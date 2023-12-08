// src/components/Login.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                sessionStorage.setItem("isLogin", true);
                window.alert("Logged in successfully");
                // Perform any additional actions after successful login
            } else {
                window.alert("Email or password is incorrect");
                // Handle the error scenario
            }
            window.location.href = "/";
        } catch (error) {
            console.error("Error logging in:", error);
            // Handle the error scenario
        }
    };

    return (
        <div>
            <Navbar />
            <div className="hero h-screen bg-white">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body text-white" onSubmit={handleLogin}>
                            <h1 className="text-2xl font-bold ">Login</h1>
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
                                <label className="label mt-1 p-2">
                                    <h1 className="text">Don't have an account? </h1>
                                    <a href="/register" className="label link-hover">Sign Up</a>
                                </label>
                            </div>
                            <div className="form-control">
                                <button type="submit" className="btn bg-white text-black" onClick={handleLogin}>Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
