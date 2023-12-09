// src/components/Register.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [face, setFace] = useState(null);

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('face', face); // Append the avatar file to the form data

            const response = await fetch("/register", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Admin registered successfully");
                window.location.reload(false);
            } else {
                alert("Failed to register.");
                // Handle the error scenario
            }
            window.location.href = "/";
        } catch (error) {
            console.error("Error registering admin:", error);
            // Handle the error scenario
        }
    };

    const handleFaceChange = (event) => {
        const file = event.target.files[0];
        setFace(file);
    };

    return (
        <div>
            <Navbar />
            <div className="hero h-screen bg-white">
                <div className="hero-content flex-col lg:flex-row-reverse text-white">
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mt-1 p-2">
                        <form className="card-body" onSubmit={handleRegister}>
                            <h1 className="text-2xl font-bold">Register</h1>
                            <div className="form-control text-white">
                                <label className="label">
                                    <span className="label-text text-white">Username</span>
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="mt-1 p-2 w-full border rounded"
                                    value={username} onChange={(event) => setUsername(event.target.value)} required />
                            </div>
                            <div className="form-control text-white">
                                <label className="label">
                                    <span className="label-text text-white">Email</span>
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    className="mt-1 p-2 w-full border rounded"
                                    value={email} onChange={(event) => setEmail(event.target.value)} required />
                            </div>
                            <div className="form-control text-white">
                                <label className="label">
                                    <span className="label-text text-white">Password</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="mt-1 p-2 w-full border rounded"
                                    value={password} onChange={(event) => setPassword(event.target.value)} required />
                            </div>
                            <div className="form-control text-white">
                                <label className="label">
                                    <span className="label-text text-white">Face Recognition</span>
                                </label>
                                <input 
                                    type="file"
                                    id="face"
                                    className="mt-1 p-2 w-full border rounded"
                                    accept="image/*"
                                    onChange={handleFaceChange}
                                />
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
