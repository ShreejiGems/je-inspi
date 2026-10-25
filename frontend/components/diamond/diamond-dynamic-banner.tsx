"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useAppContext } from "@/src/contexts/AppContext";

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

const DiamondDynamicBanner: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { loading, sectionImagesError, getBannerImage, refetchData } = useAppContext();

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
    const currentBanner = getBannerImage(isMobile ? 'DIAMOND_BANNER_MOBILE' : 'DIAMOND_BANNER_DESKTOP');

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

    // The bundled video covers loading and a new database without banner records.
    if (!currentBanner) {
        return (
            <div className="relative w-full h-[90vh] bg-brand-900">
                <video
                    src="/assets/home/Diamond.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    aria-label="JE-Inspi diamond collection"
                />
                {sectionImagesError && (
                    <div role="status" className="absolute bottom-6 left-4 right-4 mx-auto max-w-md rounded-lg bg-brand-50 p-3 text-center text-brand-900">
                        <span>{sectionImagesError}</span>{' '}
                        <button type="button" onClick={() => void refetchData()} disabled={loading} className="underline disabled:opacity-50">
                            {loading ? 'Retrying…' : 'Retry'}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    const mediaType = getMediaTypeFromUrl(currentBanner.image);

    return (
        <div className="relative w-full h-[90vh]">
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
                    alt="JE-Inspi Diamond Banner"
                    fill
                    className="object-cover"
                    priority
                />
            )}
        </div>
    );
};

export default DiamondDynamicBanner;
