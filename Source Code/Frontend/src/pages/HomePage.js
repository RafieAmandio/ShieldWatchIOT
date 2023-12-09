import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import Navbar from "../components/Navbar";
import AddDevice from "../components/AddDevice";

const HomePage = () => {
  const [pirValue, setPirValue] = useState(false);
  const [temperatureValue, setTemperatureValue] = useState(0);
  const [lightIntensityValue, setLightIntensityValue] = useState(0);
  const [cameraValue, setCamera] = useState("");

  useEffect(() => {
    const isLogin = sessionStorage.getItem("isLogin");
    if (!isLogin) {
      window.location.href = "/login";
    }

    const client = mqtt.connect("mqtt://broker.mqttdashboard.com");

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("ShieldWatchIOT", function (err) {
        if (!err) {
          client.publish("ShieldWatchIOT", "Hello from ShieldWatchIOT");
        }
      });
    });

    client.on("message", (topic, message) => {
      // Assuming data format: { pir: boolean, temperature: number, lightIntensity: number, camera: string }
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "monitoring") {
          setPirValue(data.pir);
          setTemperatureValue(data.temperature);
          setLightIntensityValue(data.ldr);
          setCamera(data.camera);
        }
      } catch (error) {
        console.error(error);
      }
    });

    // Cleanup the MQTT client on component unmount
    return () => {
      client.end();
    };
  }, []);

  const stats = [
    { id: 1, name: "PIR Sensor", value: pirValue.toString() },
    { id: 2, name: "Temperature Sensor", value: `${temperatureValue} °C` },
    {
      id: 3,
      name: "Light Intensity Sensor",
      value: `${lightIntensityValue} lux`,
    },
  ];

  return (
    <div>
      <div className="h-screen">
        <Navbar />
        <div className="bg-white flex items-end justify-end px-52">
          <AddDevice />
        </div>
        <div className="h-full bg-white py-24 sm:py-8 h-">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="mx-auto flex max-w-xs flex-col gap-y-4"
                >
                  <dt className="text-base leading-7 text-gray-600 font-medium">
                    {stat.name}
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="card w-1/2 bg-white items-center mx-auto my-12">
              <div className="card-body">
                <h2 className="card-title text-5xl text-black">Camera</h2>
              </div>
              <figure>
                <img
                  src=/*{cameraValue}*/ "https://media.suara.com/pictures/970x544/2022/11/17/50471-dinosaurus-di-kota-depok.jpg"
                  alt="Camera"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
