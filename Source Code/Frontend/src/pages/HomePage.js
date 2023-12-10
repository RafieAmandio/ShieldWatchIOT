import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import Navbar from "../components/Navbar";
import AddDevice from "../components/AddDevice";
import axios from "axios";

const HomePage = () => {
  const [devices, setDevices] = useState([]);
  const [mqttClient, setMqttClient] = useState(null);

  useEffect(() => {
    const isLogin = sessionStorage.getItem("isLogin");
    if (!isLogin) {
      window.location.href = "/login";
    }

    // Fetch devices from localStorage
    const storedDevices = JSON.parse(localStorage.getItem("user")) || [];
    setDevices(storedDevices.device);

    // Fetch monitoring data every 5 seconds
    const fetchDataInterval = setInterval(() => {
      fetchMonitoringData();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(fetchDataInterval);
  }, []);

  const handleSendWarning = async (deviceId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || [];
      // Replace 'your-backend-api-url' with the actual URL of your backend API endpoint
      const response = await axios.post("http://localhost:9696/send-warning", {
        device_id: deviceId,
        warningMessage: "Intruder Alert",
        email: user.email // You can customize the warning message here
      });

      console.log(response.data); // Log the response from the server
    } catch (error) {
      console.error("Error sending warning:", error);
    }
  };

  const fetchMonitoringData = async () => {
    try {
      console.log("test");
      // Replace 'your-backend-api-url' with the actual URL of your backend API endpoint
      const devicesPromises = devices.map(async (device) => {
        try {
          const response = await axios.post(
            "http://localhost:9696/device/latest",
            {
              device_id: device.device_id,
            }
          );
          console.log(response);

          const updatedMonitoringData = response.data;

          // Update the state based on device_id
          setDevices((prevDevices) =>
            prevDevices.map((prevDevice) => {
              if (prevDevice.device_id === updatedMonitoringData.device_id) {
                return {
                  ...prevDevice,
                  ldr: updatedMonitoringData.ldr,
                  temperature: updatedMonitoringData.temperature,
                  humidity: updatedMonitoringData.humidity,
                };
              }
              return prevDevice;
            })
          );
        } catch (error) {
          console.error(
            `Error fetching monitoring data for device ${device.device_id}:`,
            error
          );
        }
      });

      await Promise.all(devicesPromises);
      console.log(devicesPromises);
    } catch (error) {
      console.error("Error fetching monitoring data for all devices:", error);
    }
  };

  const renderWidgets = () => {
    if (devices.length === 0) {
      return (
        <div className="text-gray-900 mt-20 text-2xl font-semibold">
          No devices added. Please add a device.
        </div>
      );
    }

    return devices.map((device) => {
      if (device.type === "MONITORING") {
        return (
          <div className="indicator m-3">
            <span className="indicator-item badge badge-success mr-1"></span>
            <div className="card w-96 bg-primary text-primary-content ">
              <div className="card-body">
                <h2 className="card-title text-white">{device.device_name}</h2>
                {/* Humidity */}
                <p>Humidity: {device.humidity}%</p>

                {/* Temperature */}
                <p>Temperature: {device.temperature}°C</p>

                {/* Light Intensity */}
                <p>Light Intensity: {device.ldr} lux</p>
              </div>
            </div>
          </div>
        );
      } else if (device.type === "CAMERA") {
        return (
          <div className="indicator m-3">
            <span className="indicator-item badge badge-success mr-1"></span>
            <div className="card w-96 bg-primary text-primary-content ">
              <div className="card-body">
                <h2 className="card-title text-white">{device.device_name}</h2>
                <button
                  className="btn btn-warning"
                  onClick={() => handleSendWarning(device.device_id)}
                >
                  Send Warning
                </button>
              </div>
            </div>
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
