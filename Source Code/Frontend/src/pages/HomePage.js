import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import Navbar from "../components/Navbar";
import AddDevice from "../components/AddDevice";

const HomePage = () => {
  const [devices, setDevices] = useState([]);
  const [mqttClient, setMqttClient] = useState(null);

  useEffect(() => {
    const isLogin = sessionStorage.getItem("isLogin");
    if (!isLogin) {
      window.location.href = "/login";
    }

    // Fetch devices from localStorage
    const storedDevices = JSON.parse(localStorage.getItem("devices")) || [];
    setDevices(storedDevices);

    // Connect to MQTT broker
    const client = mqtt.connect("mqtt://broker.mqttdashboard.com");
    setMqttClient(client);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      storedDevices.forEach((device) => {
        client.subscribe(device.topic, function (err) {
          if (!err) {
            client.publish(device.topic, "Hello from ShieldWatchIOT");
          }
        });
      });
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        const updatedDevices = devices.map((device) => {
          if (device.topic === topic) {
            if (data.type === "monitoring") {
              return {
                ...device,
                pirValue: data.pir,
                temperatureValue: data.temperature,
                lightIntensityValue: data.ldr,
              };
            } else if (data.type === "camera") {
              return {
                ...device,
                cameraValue: data.camera,
              };
            }
          }
          return device;
        });
        setDevices(updatedDevices);
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      client.end();
    };
  }, [devices]);

  const renderWidgets = () => {
    if (devices.length === 0) {
      return (
        <div className="text-gray-900 mt-20 text-2xl font-semibold">
          No devices added. Please add a device.
        </div>
      );
    }

    return devices.map((device) => {
      if (device.type === "monitoring") {
        return (
          <div key={device.id} className="mx-auto max-w-xs flex flex-col gap-y-4">
            <dt className="text-base leading-7 text-gray-600 font-medium">
              {device.name}
            </dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              PIR: {device.pirValue.toString()}, Temperature:{" "}
              {`${device.temperatureValue} °C`}, Light Intensity:{" "}
              {`${device.lightIntensityValue} lux`}
            </dd>
          </div>
        );
      } else if (device.type === "camera") {
        return (
          <div key={device.id} className="mx-auto max-w-xs flex flex-col gap-y-4">
            <dt className="text-base leading-7 text-gray-600 font-medium">
              {device.name}
            </dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Camera: {device.cameraValue}
            </dd>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div>
      <div className="h-screen">
        <Navbar />
        <div className="bg-white flex items-end justify-end px-52">
          <AddDevice />
        </div>
        <div className="h-full bg-white py-24 sm:py-8 h-">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="flex items-center justify-center">
              {renderWidgets()}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
