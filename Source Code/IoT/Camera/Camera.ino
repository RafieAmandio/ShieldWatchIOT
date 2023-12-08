#include "esp_camera.h"
#include "Arduino.h"
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "driver/rtc_io.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "base64.h"

#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22
#define BUTTON_GPIO_NUM 13

const char *SSID = "Z";
const char *PASSWORD = "876543211";
const char *MQTT_BROKER = "broker.mqttdashboard.com";
const char *MQTT_TOPIC = "ShieldWatchIOT";
const char *MQTT_CLIENT_ID = "abcd";
const char *MQTT_USER = "";
const char *MQTT_PASSWORD = "";

WiFiClient espClient;
PubSubClient client(espClient);

int pictureNumber = 0;

void connectToWiFi();
void connectToMQTT();
void takePicture();

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to WiFi");

  WiFi.begin(SSID, PASSWORD, 6);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(MQTT_CLIENT_ID, MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("connected");
      client.setBufferSize(60 * 1024);
      client.subscribe(MQTT_TOPIC);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void publishFunction(String payload) {
  if (client.connected()) {
    Serial.print("Publishing payload...");

    const int chunkSize = 59 * 1024;
    int totalChunks = payload.length() / chunkSize;

    for (int i = 0; i <= totalChunks; i++) {
      int startIndex = i * chunkSize;
      int endIndex = startIndex + chunkSize;
      if (endIndex > payload.length()) {
        endIndex = payload.length();
      }

      String chunk = payload.substring(startIndex, endIndex);
      // Serial.println("Pesan: " + chunk);

      DynamicJsonDocument jsonDoc(60 * 1024);
      jsonDoc["type"] = "capture";
      jsonDoc["clientId"] = MQTT_CLIENT_ID;
      jsonDoc["sck"] = i+1;
      jsonDoc["tsck"] = totalChunks+1;
      jsonDoc["payload"] = chunk;
      

      String jsonString;
      serializeJson(jsonDoc, jsonString);

      client.publish(MQTT_TOPIC, jsonString.c_str());

      delay(200);
    }

    Serial.println("Payload published");
  } else {
    Serial.println("MQTT client not connected");
  }
}


void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); //disable brownout detector
  Serial.begin(115200);
  setup_wifi();
  client.setServer(MQTT_BROKER, 1883);
  Serial.setDebugOutput(true);

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  pinMode(4, INPUT);
  digitalWrite(4, LOW);
  rtc_gpio_hold_dis(GPIO_NUM_4);

  pinMode(BUTTON_GPIO_NUM, INPUT_PULLUP);

  if (psramFound()) {
    config.frame_size = FRAMESIZE_UXGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  // Init Camera
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
  sensor_t *s = esp_camera_sensor_get();
  s->set_framesize(s, FRAMESIZE_UXGA);     // FRAMESIZE_[QQVGA|HQVGA|QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA|QXGA(ov3660)]);
  s->set_quality(s, 10);                   // 10 to 63
  s->set_brightness(s, 0);                 // -2 to 2
  s->set_contrast(s, -1);                   // -2 to 2
  s->set_saturation(s, 0);                 // -2 to 2

  // Create a FreeRTOS task to check for serial data
  // xTaskCreatePinnedToCore(checkSerialTask, "CheckSerialTask", 4096, NULL, 1, NULL, 0);
  pinMode(4, OUTPUT);
  Serial.println("System initialized.");
  takePicture();
}

void loop() {
  // Your main code, if needed
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

void takePicture() {
  camera_fb_t * fb = NULL;
  // Take Picture with Camera
  digitalWrite(4, HIGH);
  fb = esp_camera_fb_get();
  delay(1000);//This is key to avoid an issue with the image being very dark and green. If needed adjust total delay time.
  fb = esp_camera_fb_get();
  
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }
  digitalWrite(4, LOW);

  // Convert image to Base64
  String base64Image = base64::encode(fb->buf, fb->len);

  // Print Base64 image on Serial Monitor
  Serial.println("Base64 Image:");
  Serial.println(base64Image);
  Serial.println("Done!");
  reconnect();
  Serial.println("Send to MQTT ");
  publishFunction(base64Image);



  esp_camera_fb_return(fb);

  // Delay for a moment to observe the output
  delay(500);

  // Turns off the ESP32-CAM white on-board LED (flash) connected to GPIO 4
  rtc_gpio_hold_en(GPIO_NUM_4);

  esp_sleep_enable_ext0_wakeup(GPIO_NUM_13, 0);

  // Disconnect from MQTT before going to sleep
  client.disconnect();

  delay(500);
  Serial.println("Going to sleep");
  esp_deep_sleep_start();
  Serial.println("This will never be printed");
}
