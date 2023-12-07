// src/components/Sensor.js
import React from 'react';

const Sensor = ({ type, value }) => {
    return (
        <div>
            <h2>{type} Sensor</h2>
            <p>Value: {value}</p>
        </div>
    );
};

export default Sensor;
