import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/solid'; // Import PlusIcon from Heroicons
import Sensor from './Sensor';
import AddDeviceModal from './AddDeviceModal';

const Home = ({ pirValue, temperatureValue, lightIntensityValue }) => {
    const [isAddDeviceModalOpen, setAddDeviceModalOpen] = useState(false);

    const openAddDeviceModal = () => {
        setAddDeviceModalOpen(true);
    };

    const closeAddDeviceModal = () => {
        setAddDeviceModalOpen(false);
    };

    const handleAddDevice = (deviceData) => {
        // Logika penambahan perangkat di sini
        console.log('Adding device:', deviceData);
    };

    return (
        <div className="p-8">

            <button
                onClick={openAddDeviceModal}
                className="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900"
            >
                <PlusIcon className="h-6 w-6 mr-2" />
                Add Device
            </button>


            <Sensor type="PIR" value={pirValue} />
            <Sensor type="Temperature" value={temperatureValue} />
            <Sensor type="Light Intensity" value={lightIntensityValue} />

            {/* Add other components related to yo  ur ESP32 and camera here */}

            <AddDeviceModal
                isOpen={isAddDeviceModalOpen}
                onRequestClose={closeAddDeviceModal}
                onAddDevice={handleAddDevice}
                className="transition duration-200 ease-in-out transform scale-100"
            >
                {/* Konten modal di sini */}
            </AddDeviceModal>

        </div>
    );
};

export default Home;
