import React, { useState } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', // Adjust the width as needed
        maxWidth: '400px', // Set a maximum width
    },
};

const AddDeviceModal = ({ isOpen, onRequestClose }) => {
    const { register, handleSubmit } = useForm();
    const [selectedDeviceType, setSelectedDeviceType] = useState('');

    const addDevice = async (data) => {
        const deviceData = { ...data, deviceType: selectedDeviceType };

        try {
            const response = await fetch('http://localhost:3000/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deviceData),
            });

            if (response.ok) {
                console.log('Device added successfully');
                onRequestClose();
            } else {
                console.error('Failed to add device');
            }
        } catch (error) {
            console.error('Error adding device:', error);
        }
    };

    const handleDeviceTypeSelect = (deviceType) => {
        setSelectedDeviceType(deviceType);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className="bg-white p-6 flex-row rounded-lg">
                <h2 className="text-xl text-black text-center font-bold mb-4">Add Device</h2>
                <form addDevice={handleSubmit(addDevice)}>
                    <div className="mb-4">
                        <label htmlFor="deviceName" className="block text-gray-700 font-semibold">Device Name:</label>
                        <input
                            type="text"
                            id="deviceName"
                            {...register('deviceName')}
                            className="form-input mt-1 bg-white border-2 border-gray-400 block w-full text-black"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="deviceID" className="block text-gray-700 font-semibold">Device ID:</label>
                        <input
                            type="text"
                            id="deviceID"
                            {...register('deviceID')}
                            className="form-input mt-1 bg-white border-2 border-gray-400 block w-full text-black"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="deviceType" className="block text-gray-700 font-semibold">Device Type:</label>
                        <div className="dropdown dropdown-right">
                            <div tabIndex={0} role="button" className="btn m-1">
                                {selectedDeviceType ? selectedDeviceType : 'Choose'}
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 ">
                                <li
                                    onClick={() => handleDeviceTypeSelect('Monitoring')}
                                    className="hover:bg-gray-500 hover:text-white cursor-pointer label"
                                >
                                    Monitoring
                                </li>
                                <li
                                    onClick={() => handleDeviceTypeSelect('Camera')}
                                    className="hover:bg-gray-500 hover:text-white cursor-pointer label"
                                >
                                    Camera
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button type="submit" className="btn text-white w-full mt-6">
                        Add Device
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default AddDeviceModal;
