'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Modal, Steps } from 'antd';
import { IoMailOutline } from "react-icons/io5";
import { MdArrowBack, MdCheckCircle } from "react-icons/md";
import { authAPI, SendOtpRequest, VerifyOtpRequest } from '@/src/services/auth.api';
import { utilityHelper } from '@/src/libs/helper';
import { garamond } from '@/src/common/helper';

const { Step } = Steps;

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
  onBackToRegister: () => void;
  verificationType: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
  onBackToRegister,
  verificationType
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  // Automatically send OTP when modal opens
  useEffect(() => {
    if (isOpen && email) {
      handleSendOtp();
    }
  }, [isOpen, email]);

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await authAPI.sendOtp({ email, otpType: verificationType } as SendOtpRequest);
      message.success('OTP sent to your email address!');
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
      message.success('Email verified successfully!');
      setCurrentStep(2);
      setTimeout(() => {
        onVerificationSuccess();
      }, 1500);
    } catch (error: any) {
      message.error(utilityHelper.formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Since OTP is sent automatically, always go back to register
    onBackToRegister();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Skip this step since OTP is sent automatically
        return null;
      
      case 1:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleVerifyOtp}
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoMailOutline className="text-4xl text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: garamond.style.fontFamily }}>
                Enter OTP
              </h3>
              <p className="text-brand-700 mb-2" style={{ fontFamily: garamond.style.fontFamily }}>
                We've sent a 6-digit OTP to
              </p>
              <p className="font-semibold text-brand-600" style={{ fontFamily: garamond.style.fontFamily }}>
                {email}
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
                onClick={handleSendOtp}
                style={{ color: '#526f4d', fontFamily: garamond.style.fontFamily }}
              >
                Didn't receive OTP? Resend
              </Button>
            </div>
          </Form>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdCheckCircle className="text-4xl text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: garamond.style.fontFamily }}>
              Email Verified Successfully!
            </h3>
            <p className="text-brand-700" style={{ fontFamily: garamond.style.fontFamily }}>
              Your email address has been verified. You can now proceed with your registration.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div className="text-center">
          <h2 className="text-2xl font-bold" style={{ color: '#526f4d', fontFamily: garamond.style.fontFamily }}>
            Email Verification
          </h2>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      styles={{
        header: { borderBottom: '1px solid #f1f4ed' },
        body: { padding: '24px' }
      }}
    >
      <div className="email-verification-modal">
        <div className="flex items-center justify-between mb-6">
          <Button
            type="text"
            icon={<MdArrowBack />}
            onClick={handleBack}
            className="flex items-center text-brand-600 hover:text-brand-700"
            style={{ fontFamily: garamond.style.fontFamily }}
          >
            {currentStep === 0 ? 'Back to Register' : 'Back'}
          </Button>
          
          <Steps current={currentStep} size="small" className="flex-1 mx-4">
            <Step title="Send" />
            <Step title="Verify" />
            <Step title="Complete" />
          </Steps>
        </div>

        {renderStepContent()}
      </div>
    </Modal>
  );
};

export default EmailVerificationModal;
