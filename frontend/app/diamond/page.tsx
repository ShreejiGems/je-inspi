"use client";
import React from 'react';
import DiamondPage from '@/components/diamond/diamond';
import { Suspense } from 'react';

export default function Diamond() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DiamondPage />
        </Suspense>
    );
}
