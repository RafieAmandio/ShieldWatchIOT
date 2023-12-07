// src/components/Login.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log(`Login with email: ${email} and password: ${password}`);
    };

    return (
        <div>
            <Navbar />
            <div className="hero h-screen bg-white">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body">
                            <h1 className="text-2xl font-bold">Login</h1>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    className="mt-1 p-2 w-full border rounded"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="mt-1 p-2 w-full border rounded"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className="label mt-1 p-2">
                                    <h1 className="text">Don't have an account? </h1>
                                    <a href="/register" className="label link-hover">Register</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;
