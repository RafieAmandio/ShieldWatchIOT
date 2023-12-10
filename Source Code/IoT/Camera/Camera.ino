#include "esp_camera.h"
#include "Arduino.h"
#include "soc/soc.h"           // Disable brownout problems
#include "soc/rtc_cntl_reg.h"  // Disable brownout problems
#include "driver/rtc_io.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <EEPROM.h>        
#include "base64.h"

// Untuk menyimpan pictureNumber
#define EEPROM_SIZE 1

// Pin Untuk CAMERA_MODEL_AI_THINKER
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
#define BUTTON_GPIO_NUM 13 // GPIO for the button

const char *SSID = "";
const char *PASSWORD = "";
const char *MQTT_BROKER = "broker.mqttdashboard.com";
const char *MQTT_TOPIC = "ShieldWatchIOT";
const char *MQTT_CLIENT_ID = "ESPCAM";
const char *MQTT_USER = "";
const char *MQTT_PASSWORD = "";

WiFiClient espClient;
PubSubClient client(espClient);

int pictureNumber = 0;


void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); //disable brownout detector
  Serial.begin(115200);
  setup_wifi();
 
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
  config.frame_size = FRAMESIZE_UXGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA
  config.jpeg_quality = 10;
  config.fb_count = 2;
  pinMode(4, INPUT);
  digitalWrite(4, LOW);
  rtc_gpio_hold_dis(GPIO_NUM_4);

  pinMode(BUTTON_GPIO_NUM, INPUT_PULLUP);

  // Init Camera
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t *s = esp_camera_sensor_get();
  s->set_brightness(s, 2);                 // -2 to 2
  s->set_contrast(s, -2);                   // -2 to 2
  s->set_saturation(s, 0);                 // -2 to 2

  pinMode(4, OUTPUT);
  Serial.println("System initialized.");
  delay(1000);
  takePicture();
}

void loop() {
}

//Connect ke MQTT
void reconnect() {
  client.setServer(MQTT_BROKER, 1883);
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

// Fungsi untuk mengambil Gambar
void takePicture() {
  camera_fb_t * fb = NULL;
  // Take Picture with Camera
  digitalWrite(4, HIGH);
  fb = esp_camera_fb_get();  
  delay(2000);//This is key to avoid an issue with the image being very dark and green. If needed adjust total delay time.
  fb = esp_camera_fb_get();
  
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }
  digitalWrite(4, LOW);

  // initialize EEPROM with predefined size
  EEPROM.begin(EEPROM_SIZE);
  pictureNumber = EEPROM.read(0) + 1;
  
  // konversi image to Base64
  String base64Image = base64::encode(fb->buf, fb->len);

  // Print Base64 image on Serial Monitor
  // Serial.println("Base64 Image:");
  // Serial.println(base64Image);
  // Serial.println("Done!");

  // Koneksi ke MQTT
  reconnect();
  Serial.println("Send to MQTT ");
  // Mengirimkan Gambar ke MQTT
  publishFunction(base64Image);

  EEPROM.write(0, pictureNumber);
  EEPROM.commit();

  esp_camera_fb_return(fb);

  // Delay for a moment to observe the output
  delay(500);

  // Turns off the ESP32-CAM white on-board LED (flash) connected to GPIO 4
  rtc_gpio_hold_en(GPIO_NUM_4);

  // ESP akan dapat dibangunkan pada saat pin 13 (PIR Sensor) mendeteksi
  esp_sleep_enable_ext0_wakeup(GPIO_NUM_13, 0);

  delay(500);
  Serial.println("Going to Sleep");
  // SLeep
  esp_deep_sleep_start();
  Serial.println("This will never be printed");
}

// Fungsi untuk mengirimkan ke MQTT
void publishFunction(String payload) {
  if (client.connected()) {
    Serial.print("Publishing payload...");

    // Membagi payload ke menjadi beberapa segment
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

      // Dikirimkan dalam bentuk JSON
      DynamicJsonDocument jsonDoc(60 * 1024);
      jsonDoc["type"] = "capture";
      jsonDoc["deviceId"] = MQTT_CLIENT_ID;
      jsonDoc["packet_no"] = pictureNumber;
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

// Koneksi ke Wifi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to WiFi");

  WiFi.begin(SSID, PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
