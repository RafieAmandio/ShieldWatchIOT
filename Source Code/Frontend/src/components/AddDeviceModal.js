// src/components/AddDeviceModal.js
import React from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';

const AddDeviceModal = ({ isOpen, onRequestClose, onAddDevice }) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        onAddDevice(data);
        onRequestClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2 className='text-xl text-black '>Add Device</h2>
            <form className='mt-6' onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="deviceName">Device Name: </label>
                <input type="text" id="deviceName" {...register('deviceName')} />

                <label htmlFor="deviceType">Device Type: </label>
                <input type="text" id="deviceType" {...register('deviceType')} />

                <button type="submit" className="btn btn-primary form-control mt-6">Add Device</button>
            </form>
        </Modal>
    );
};

export default AddDeviceModal;
