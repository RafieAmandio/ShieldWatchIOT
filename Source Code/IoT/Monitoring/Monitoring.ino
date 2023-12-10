#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define DHTPIN 14    // Pin DHT22
#define DHTTYPE DHT11 // Tipe sensor DHT yang digunakan
const int ldrPin = 34;  // Pin LDR
const int ledPin = 21;   // Pin LED
const int buzzerPin = 4; // Pin buzzer
const int pirPin = 15;   // Pin sensor PIR

const char *SSID = "";
const char *PASSWORD = "";
const char *MQTT_BROKER = "broker.mqttdashboard.com";
const char *MQTT_TOPIC = "ShieldWatchIOT";
const char *MQTT_CLIENT_ID = "idmnbvcxz";
const char *MQTT_USER = "";
const char *MQTT_PASSWORD = "";

WiFiClient espClient;
PubSubClient client(espClient);

DHT dht(DHTPIN, DHTTYPE);

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
      client.subscribe(MQTT_TOPIC);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void messageCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic: ");
  Serial.println(topic);

  Serial.print("Payload: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Mengonversi payload ke objek JSON
  DynamicJsonDocument jsonDoc(256);
  deserializeJson(jsonDoc, payload, length);

  // Mengecek apakah ada field "type" dan nilainya adalah "warning"
  const char* type = jsonDoc["type"];
  if (type && strcmp(type, "warning") == 0) {
    // Menyalakan buzzer
    digitalWrite(buzzerPin, HIGH);
    delay(1000);  // Menahan buzzer selama 1 detik
    digitalWrite(buzzerPin, LOW);

    // Mencetak pesan "WARNING" pada Serial Monitor
    Serial.println("WARNING");
  }

}

void publishTaskFunction(void *pvParameters) {
  for (;;) {
    if (client.connected()) {
      // Baca nilai dari sensor LDR
      int ldrValue = analogRead(ldrPin);

      // Baca nilai dari sensor DHT22
      float temperature = dht.readTemperature();
      float humidity = dht.readHumidity();

      // Baca status PIR sensor
      int pirValue = digitalRead(pirPin);

      // Buat objek JSON
      StaticJsonDocument<256> jsonDocument;
      jsonDocument["type"] = "monitoring";
      jsonDocument["device_id"] = MQTT_CLIENT_ID;
      jsonDocument["ldr"] = ldrValue;
      jsonDocument["temperature"] = temperature;
      jsonDocument["humidity"] = humidity;

      // Serialisasi JSON menjadi string
      String jsonString;
      serializeJson(jsonDocument, jsonString);

      // Kirim JSON ke broker MQTT
      client.publish(MQTT_TOPIC, jsonString.c_str());
      
      // Tunda selama 5 detik
      delay(5000);
    }

    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void ldrTask(void *parameter) {
  while (1) {
    // Baca nilai dari sensor LDR
    int ldrValue = analogRead(ldrPin);
    
    // Tampilkan nilai LDR
    Serial.print("LDR Value: ");
    Serial.println(ldrValue);

    // Tunda task selama 1 detik
    vTaskDelay(pdMS_TO_TICKS(1000));
  }
}

void ledTask(void *parameter) {
  while (1) {
    // Baca nilai dari sensor LDR
    int ldrValue = analogRead(ldrPin);

    // Kendalikan LED berdasarkan nilai LDR
    if (ldrValue > 500) {
      // Jika nilai LDR tinggi (siang), matikan LED
      digitalWrite(ledPin, LOW);
    } else {
      // Jika nilai LDR rendah (malam), nyalakan LED
      digitalWrite(ledPin, HIGH);
    }

    // Tunda task selama 1 detik
    vTaskDelay(pdMS_TO_TICKS(1000));
  }
}

void readDHTTask(void *parameter) {
  (void)parameter;

  for (;;) {
    // Membaca suhu dan kelembaban dari sensor DHT22
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    // Menampilkan hasil pada Serial Monitor
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C, Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");

    // Menunggu 2 detik sebelum membaca sensor lagi
    vTaskDelay(pdMS_TO_TICKS(2000));
  }
}

void buzzerTask(void *parameter) {
  (void)parameter;

  for (;;) {
    // Membaca status PIR sensor
    int pirValue = digitalRead(pirPin);

    // Jika PIR sensor mendeteksi gerakan/objek
    if (pirValue == HIGH) {
      // Mengatur buzzer untuk berbunyi
      digitalWrite(buzzerPin, HIGH);
    } else {
      // Menghentikan bunyi buzzer
      digitalWrite(buzzerPin, LOW);
    }

    // Menunggu 100 milidetik sebelum membaca PIR sensor lagi
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}

void setup() {
  Serial.begin(115200);

  setup_wifi();
  client.setServer(MQTT_BROKER, 1883);
  client.setCallback(messageCallback);

  // Konfigurasi pin untuk LED sebagai output
  pinMode(ledPin, OUTPUT);

  // Inisialisasi sensor DHT22
  dht.begin();

  // Konfigurasi pin buzzer sebagai output
  pinMode(buzzerPin, OUTPUT);
  
  xTaskCreate(publishTaskFunction, "PublishTask", 10000, NULL, 1, NULL);// Task untuk publish suatu value
  xTaskCreate(ldrTask, "LDR Task", 1000, NULL, 1, NULL);// Task untuk membaca nilai dari sensor LDR
  xTaskCreate(ledTask, "LED Task", 1000, NULL, 1, NULL);// Task untuk mengendalikan LED berdasarkan nilai LDR
  xTaskCreate(readDHTTask, "DHT Task", 10000, NULL, 1, NULL);// Task untuk membaca sensor DHT22
  xTaskCreate(buzzerTask, "Buzzer Task", 10000, NULL, 1, NULL); // Task untuk mengatur buzzer
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
