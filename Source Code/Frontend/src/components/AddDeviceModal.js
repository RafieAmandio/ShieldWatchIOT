import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%", // Adjust the width as needed
    maxWidth: "400px", // Set a maximum width
  },
};

const AddDeviceModal = ({ isOpen, onRequestClose }) => {
  const [deviceName, setDeviceName] = useState("");
  const [deviceID, setDeviceID] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState("");

  const addDevice = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:9696/device/add", {
        userId: JSON.parse(localStorage.getItem("user"))?._id,
        device_name: deviceName,
        device_id: deviceID,
        type: selectedDeviceType,
      });

      console.log(response);

      const data = response.data.result;
      console.log(data);

      if (response.status === 200) {
        console.log("Device added successfully");
        onRequestClose();
      } else {
        console.error("Failed to add device");
      }
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const handleDeviceTypeSelect = (deviceType) => {
    setSelectedDeviceType(deviceType);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card shrink-0 w-full max-w-sm">
          <form className="card-body" onSubmit={addDevice}>
            <h2 className="text-xl font-bold text-center mb-4 text-black">
              Add Device
            </h2>
            <div className="mb-4 ">
              <label
                htmlFor="deviceName"
                className="block text-black font-semibold"
              >
                Device Name:
              </label>
              <input
                type="text"
                id="deviceName"
                className="mt-1 p-2 w-full border rounded"
                value={deviceName}
                onChange={(event) => setDeviceName(event.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="deviceID"
                className="block text-black font-semibold"
              >
                Device ID:
              </label>
              <input
                type="text"
                id="deviceID"
                className="mt-1 p-2 w-full border rounded"
                value={deviceID}
                onChange={(event) => setDeviceID(event.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="deviceType"
                className="block text-black font-semibold"
              >
                Device Type:
              </label>
              <div className="dropdown dropdown-right">
                <div tabIndex={0} role="button" className="btn m-1 bg-black">
                  {selectedDeviceType ? selectedDeviceType : "Choose"}
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-black rounded-box w-52 "
                >
                  <li
                    onClick={() => handleDeviceTypeSelect("MONITORING")}
                    className="hover:bg-gray-500 hover:text-white cursor-pointer label"
                  >
                    MONITORING
                  </li>
                  <li
                    onClick={() => handleDeviceTypeSelect("CAMERA")}
                    className="hover:bg-gray-500 hover:text-white cursor-pointer label"
                  >
                    CAMERA
                  </li>
                </ul>
              </div>
            </div>
            <div className="form-control">
              <button
                type="submit"
                className="btn text-white w-full mt-6"
                onClick={addDevice}
              >
                Add Device
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddDeviceModal;
