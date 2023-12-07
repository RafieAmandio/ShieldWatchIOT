import React from 'react';
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

const AddDeviceModal = ({ isOpen, onRequestClose, onAddDevice }) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        onAddDevice(data);
        onRequestClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className="bg-white p-6 flex-row rounded-lg">
                <h2 className="text-xl text-black text-center font-bold mb-4">Add Device</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                        <label htmlFor="deviceType" className="block text-gray-700 font-semibold">Device Type:</label>
                        <input
                            type="text"
                            id="deviceType"
                            {...register('deviceType')}
                            className="form-input mt-1 bg-white border-2 border-gray-400 block w-full text-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn text-white w-full mt-4"
                    >
                        Add Device
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default AddDeviceModal;
