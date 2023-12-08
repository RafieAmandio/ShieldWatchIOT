import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ options, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="mb-4" ref={dropdownRef}>
            <label htmlFor="deviceType" className="block text-gray-700 font-semibold">
                Device Type:
            </label>
            <div className="dropdown relative">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn m-1"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selected || 'Choose'}
                </div>
                {isOpen && (
                    <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        {options.map((option) => (
                            <li key={option}>
                                <a onClick={() => handleSelect(option)}>{option}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
