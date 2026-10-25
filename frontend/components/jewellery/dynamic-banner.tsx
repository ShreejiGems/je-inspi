"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useAppContext } from "@/src/contexts/AppContext";
import { useAuth } from "@/src/contexts/AuthContext";

interface SectionImage {
    id: string;
    image: string;
    imageType: string;
    mediaType: string;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

const DynamicBanner: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { loading, error, sectionImages, getBannerImage } = useAppContext();
    const { hoveredItem } = useAuth();

    // Check screen size for responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkScreenSize();

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Get the appropriate banner based on screen size
    const currentBanner = getBannerImage(isMobile ? 'JEWELLERY_BANNER_MOBILE' : 'JEWELLERY_BANNER_DESKTOP');

    // Detect media type from URL extension
    const getMediaTypeFromUrl = (url: string): 'video' | 'image' => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

        const urlLower = url.toLowerCase();

        for (const ext of videoExtensions) {
            if (urlLower.includes(ext)) {
                return 'video';
            }
        }

        for (const ext of imageExtensions) {
            if (urlLower.includes(ext)) {
                return 'image';
            }
        }

        // Default to image if extension is not recognized
        return 'image';
    };

    // Render loading state
    if (loading) {
        return (
            <div className="relative w-full h-[90vh] bg-brand-100 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-brand-600">Loading banner...</div>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="relative w-full h-[90vh] bg-brand-100 flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!currentBanner) {
        return (
            <div className="relative w-full h-[90vh] bg-brand-100 flex items-center justify-center">
                <div className="text-brand-600">No banner available</div>
            </div>
        );
    }

    const mediaType = getMediaTypeFromUrl(currentBanner.image);

    return (
        <div className={`relative w-full h-[90vh] ${hoveredItem !== null ? "blur-[4px] bg-brand-200" : ""}`}>
            {mediaType === 'video' ? (
                <video
                    src={currentBanner.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                />
            ) : (
                <Image
                    src={currentBanner.image}
                    alt="JE-Inspi Banner"
                    fill
                    className="object-cover"
                    priority
                />
            )}
        </div>
    );
};

export default DynamicBanner;
