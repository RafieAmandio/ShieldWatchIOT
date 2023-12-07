// src/pages/HomePage.js
import React from 'react';
import Home from '../components/Home';
import { Link } from 'react-router-dom';
import mqtt from 'mqtt';

const HomePage = () => {
    {/*const client = mqtt.connect('broker.mqttdashboard.com');

    client.on('connect', () => {    
        client.subscribe('ShieldWatchIOT');
    });

    client.on("message", (topic, message) => {
        console.log(`Received message on topic ${topic}`);
        console.log(JSON.parse(message.toString()));
    });
*/}
    const pirValue = true;
    const temperatureValue = 25;
    const lightIntensityValue = 500;

    return (
        <div>
            <div className="navbar bg-base-100 ">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost text-xl">
                        ShieldWatch
                    </Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <details>
                                <summary className="label">Account</summary>
                                <ul className="p-2 bg-base-100 rounded-t-none">
                                    <li>
                                        <Link to="/login" className="label link-hover">
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/register" className="label link-hover">
                                            Register
                                        </Link>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Home Component */}
            <div className="mt-4">
                <Home
                    pirValue={pirValue}
                    temperatureValue={temperatureValue}
                    lightIntensityValue={lightIntensityValue}
                />
            </div>
        </div>
    );
};

export default HomePage;
