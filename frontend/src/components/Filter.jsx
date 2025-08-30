import React, { useState } from 'react'

export default function Filter() {

    return (
        <div>

            <div className='flex'>

            </div>

        </div>
    )
}

const Input = ({ type, name, value, setValue }) => {

    const className = "border border-gray-300 rounded-md p-2 w-full h-10 focus:outline-none focus:ring-2 focus:ring-blue-500";
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={className}
        />
    )
}

const Select = ({ name, value, setValue, options }) => {
    
}
