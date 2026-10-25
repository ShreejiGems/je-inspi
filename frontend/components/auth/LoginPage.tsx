'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { garamond } from "@/src/common/helper";
import LoginForm from './LoginForm';
import ForgotPasswordModal from './ForgotPasswordModal';
import ShreejiLoader from '@/components/common/shreejiLoader';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    // Simulate page loading time
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 100); // 0.1 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    router.push('/');
  };

  const handleSwitchToRegister = () => {
    router.push('/register');
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-200 via-brand-100 to-brand-200 flex items-center justify-center">
        <ShreejiLoader size="medium" text="" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-brand-200 via-brand-100 to-brand-200 flex items-center justify-center p-4 ${garamond.className}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/assets/brand/je-inspi-wordmark.png"
            width={151}
            height={68}
            alt="JE-Inspi logo"
            className="mx-auto mb-6 cursor-pointer"
            onClick={() => router.push('/')}
          />
          <h2
            className="text-2xl font-bold text-[#526f4d]"
            style={{ fontFamily: garamond.style.fontFamily }}
          >
            {showForgotPassword ? 'Forgot Password' : 'Welcome Back!'}
          </h2>
          <p
            className="text-sm text-brand-600 mt-2"
            style={{ fontFamily: garamond.style.fontFamily }}
          >
            {showForgotPassword ? 'Reset your password in a few steps' : 'Sign in to your account'}
          </p>
        </div>

        {/* Login Form or Forgot Password */}
        {showForgotPassword ? (
          <ForgotPasswordModal
            isOpen={true}
            onClose={() => router.push('/')}
            onBackToLogin={handleBackToLogin}
            verificationType="FORGET_PASSWORD"
          />
        ) : (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
            onForgotPassword={handleForgotPassword}
            showRegisterLink={true}
            buttonText="Login"
            buttonBlock={true}
          />
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-brand-600">
            © 2025 JE-Inspi. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
