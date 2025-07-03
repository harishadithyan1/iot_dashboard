#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

#define WIFI_SSID "Harish4G"
#define WIFI_PASSWORD "Harish@2006"

ESP8266WebServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Connected!");
  Serial.println(WiFi.localIP());
  
  server.on("/", HTTP_GET, []() {
    int value = analogRead(A0);
    String json = "{\"value\":" + String(value) + "}";
    server.send(200, "application/json", json);
  });

  server.begin();
}

void loop() {
  server.handleClient();
}
