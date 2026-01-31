import React from 'react';

const Card = ({
    children,
    className = '',
    variant = 'default',
    hover = false,
    ...props
}) => {
    const baseStyles = "rounded-2xl p-6 transition-all duration-300";

    const variants = {
        default: "bg-white border border-gray-100 shadow-sm",
        glass: "glass",
        flat: "bg-gray-50 border border-gray-100",
        primary: "bg-primary-600 text-white shadow-lg shadow-primary-600/20",
        gradient: "bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-lg shadow-primary-600/20",
        custom: "",
    };

    const hoverStyles = hover ? "hover:shadow-lg hover:-translate-y-1" : "";

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
