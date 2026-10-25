// Loader.tsx
"use client";
import React from "react";

interface LoaderProps {
    message?: string;
    size?: number; // size in px (default 48px)
    color?: string; // tailwind color class
}

const Loader: React.FC<LoaderProps> = ({
    message = "Loading...",
    size = 48,
    color = "border-brand-600",
}) => {
    return (
        <div className="h-40 flex items-center justify-center">
            <div className="text-center">
                <div
                    className={`animate-spin rounded-full border-b-2 ${color} mx-auto mb-4`}
                    style={{ width: size, height: size }}
                />
                <p className="text-brand-700">{message}</p>
            </div>
        </div>
    );
};

export default Loader;
