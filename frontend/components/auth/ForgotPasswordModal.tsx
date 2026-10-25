'use client';

import React, { useState } from 'react';
import { Form, Input, Button, message, Steps } from 'antd';
import { IoMailOutline } from "react-icons/io5";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { MdArrowBack, MdLockReset } from "react-icons/md";
import { authAPI, SendOtpRequest, VerifyOtpRequest, ChangePasswordRequest } from '@/src/services/auth.api';
import { utilityHelper } from '@/src/libs/helper';
import { garamond } from '@/src/common/helper';

const { Step } = Steps;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
  verificationType: string;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onBackToLogin, verificationType }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSendOtp = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      await authAPI.sendOtp({ email: values.email, otpType: verificationType } as SendOtpRequest);
      message.success('OTP sent to your email address!');
      setEmail(values.email);
      setCurrentStep(1);
    } catch (error: any) {
      message.error(utilityHelper.formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    setIsLoading(true);
    try {
      const response = await authAPI.verifyOtp({
        email,
        otp: parseInt(values.otp)
      } as VerifyOtpRequest);
      message.success('OTP verified successfully!');
      setCurrentStep(2);
    } catch (error: any) {
      message.error(utilityHelper.formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.changePassword({
        email,
        password: values.password
      } as ChangePasswordRequest);
      message.success('Password reset successfully!');
      setTimeout(() => {
        onBackToLogin();
      }, 500);
    } catch (error: any) {
      message.error(utilityHelper.formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onBackToLogin();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSendOtp}
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: garamond.style.fontFamily }}>
                Forgot Your Password?
              </h3>
              <p className="text-brand-700" style={{ fontFamily: garamond.style.fontFamily }}>
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>

            <Form.Item
              name="email"
              label={<span style={{ fontFamily: garamond.style.fontFamily }}>Email Address</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your email"
                suffix={<IoMailOutline />}
                style={{ fontFamily: garamond.style.fontFamily }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                block
                className={`${isLoading ? '' : 'button-hover-effect'} !text-white !bg-brand-600 hover:!bg-brand-700 border !border-[#526f4d] !h-12 ${garamond.className}`}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleVerifyOtp}
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: garamond.style.fontFamily }}>
                Enter OTP
              </h3>
              <p className="text-brand-700" style={{ fontFamily: garamond.style.fontFamily }}>
                We've sent a 6-digit OTP to {email}
              </p>
            </div>

            <Form.Item
              name="otp"
              label={<span style={{ fontFamily: garamond.style.fontFamily }}>One-Time Password</span>}
              rules={[
                { required: true, message: 'Please enter the OTP' },
                { len: 6, message: 'OTP must be 6 digits' },
                { pattern: /^\d+$/, message: 'OTP must contain only numbers' }
              ]}
            >
              <Input
                size="large"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                style={{ fontFamily: garamond.style.fontFamily, textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                block
                className={`${isLoading ? '' : 'button-hover-effect'} !text-white !bg-brand-600 hover:!bg-brand-700 border !border-[#526f4d] !h-12 ${garamond.className}`}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </Form.Item>

            <div className="text-center mt-4">
              <Button
                type="link"
                onClick={() => setCurrentStep(0)}
                style={{ color: '#526f4d', fontFamily: garamond.style.fontFamily }}
              >
                Didn't receive OTP? Resend
              </Button>
            </div>
          </Form>
        );

      case 2:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleResetPassword}
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: garamond.style.fontFamily }}>
                Reset Password
              </h3>
              <p className="text-brand-700" style={{ fontFamily: garamond.style.fontFamily }}>
                Enter your new password below.
              </p>
            </div>

            <Form.Item
              name="password"
              label={<span style={{ fontFamily: garamond.style.fontFamily }}>New Password</span>}
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 8, message: 'Password must be at least 8 characters long' },
                { 
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
                }
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter new password"
                style={{ fontFamily: garamond.style.fontFamily }}
                iconRender={(visible) => (visible ? <RiEyeOffLine /> : <RiEyeLine />)}
              />
            </Form.Item>

            <div className="mb-4">
              <p className="text-xs text-brand-700" style={{ fontFamily: garamond.style.fontFamily }}>
                Password must contain:
              </p>
              <ul className="text-xs text-brand-600 mt-1 space-y-1" style={{ fontFamily: garamond.style.fontFamily }}>
                <li>• At least 8 characters</li>
                <li>• One uppercase letter (A-Z)</li>
                <li>• One lowercase letter (a-z)</li>
                <li>• One number (0-9)</li>
                <li>• One special character (@$!%*?&)</li>
              </ul>
            </div>

            <Form.Item
              name="confirmPassword"
              label={<span style={{ fontFamily: garamond.style.fontFamily }}>Confirm New Password</span>}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Confirm new password"
                style={{ fontFamily: garamond.style.fontFamily }}
                iconRender={(visible) => (visible ? <RiEyeOffLine /> : <RiEyeLine />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                block
                className={`${isLoading ? '' : 'button-hover-effect'} !text-white !bg-brand-600 hover:!bg-brand-700 border !border-[#526f4d] !h-12 ${garamond.className}`}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
                {isLoading ? '' : <MdLockReset className="icon" />}
              </Button>
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="forgot-password-modal">
      <div className="flex items-center justify-between mb-6">
        <Button
          type="text"
          icon={<MdArrowBack />}
          onClick={handleBack}
          className="flex items-center text-brand-600 hover:text-brand-700"
          style={{ fontFamily: garamond.style.fontFamily }}
        >
          {currentStep === 0 ? 'Back to Login' : 'Back'}
        </Button>

        <Steps current={currentStep} size="small" className="flex-1 mx-4">
          <Step title="Email" />
          <Step title="OTP" />
          <Step title="Reset" />
        </Steps>
      </div>

      {renderStepContent()}
    </div>
  );
};

export default ForgotPasswordModal;
