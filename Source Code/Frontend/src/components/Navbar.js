import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar bg-white px-52 py-4">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl text-black">
                    ShieldWatch
                </Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <details>
                            <summary className="label text-black font-semibold">Account</summary>
                            <ul className="p-2 bg-base-100 rounded-t-none">
                                <li>
                                    <Link to="/login" className="label">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="label">
                                        Register
                                    </Link>
                                </li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar