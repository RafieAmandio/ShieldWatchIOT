// src/components/Register.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3001/RegisterAdmin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                alert("Admin registered successfully");
                window.location.reload(false);
            } else {
                alert("Failed to register admin");
                // Handle the error scenario
            }
            window.location.href = "/";
        } catch (error) {
            console.error("Error registering admin:", error);
            // Handle the error scenario
        }
    };

    return (
        <div>
            <Navbar />
            <div className="hero h-screen bg-white">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mt-1 p-2">
                        <form className="card-body" onSubmit={handleRegister}>
                            <h1 className="text-2xl font-bold">Register</h1>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    className="mt-1 p-2 w-full border rounded"
                                    value={email} onChange={(event) => setEmail(event.target.value)} required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="mt-1 p-2 w-full border rounded"
                                    value={password} onChange={(event) => setPassword(event.target.value)} required />
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn bg-white text-black" onClick={handleRegister}>Sign Up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
