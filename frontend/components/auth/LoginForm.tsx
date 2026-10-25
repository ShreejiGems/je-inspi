'use client';

import React, { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { authAPI, LoginRequest } from '@/src/services/auth.api';
import { authHelper, utilityHelper } from '@/src/libs/helper';
import { Form, Input, Button, message } from 'antd';
import { IoMailOutline } from "react-icons/io5";
import { garamond } from '@/src/common/helper';
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { MdOutlineLogin } from "react-icons/md";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
  showRegisterLink?: boolean;
  buttonText?: string;
  buttonBlock?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
  showRegisterLink = true,
  buttonText = 'Login',
  buttonBlock = false
}) => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: LoginRequest) => {
    setIsLoading(true);
    try {
      const response: any = await authAPI.login(values);

      if(response.verficationType === "PENDING"){
        message.warning("Your account verification is in progress. Please wait once approved, you’ll receive an email with your login details.");
        return;
      }

      login(response.userSession.authToken, response);
      message.success('Login successful!');

      authHelper.setToken(response.userSession.authToken);
      authHelper.setUserData(response);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      message.error(utilityHelper.formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        userType: 'USER',
      }}
    >
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

      <Form.Item
        name="password"
        label={<span style={{ fontFamily: garamond.style.fontFamily }}>Password</span>}
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password
          size="large"
          placeholder="Enter your password"
          style={{ fontFamily: garamond.style.fontFamily }}
          iconRender={(visible) => (visible ? <RiEyeOffLine /> : <RiEyeLine />)}

        />
      </Form.Item>

      <Form.Item name="userType" hidden>
        <Input style={{ fontFamily: garamond.style.fontFamily }} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isLoading}
          block={buttonBlock}
          className={`${isLoading ? '' : 'button-hover-effect'} !text-white !bg-brand-600 hover:!bg-brand-700 border !border-[#526f4d] !h-12 ${garamond.className}`}
        >
          {isLoading ? 'Logging in...' : buttonText}
          {isLoading ? '' : <MdOutlineLogin className="icon" />}
        </Button>
      </Form.Item>

      {onForgotPassword && (
        <div className="text-center mb-4">
          <Button
            type="link"
            onClick={onForgotPassword}
            className="hover:!underline hover:!underline-offset-1"
            style={{ color: '#526f4d', padding: 0, fontFamily: garamond.style.fontFamily }}
          >
            Forgot your password?
          </Button>
        </div>
      )}

      {showRegisterLink && onSwitchToRegister && (
        <div className="text-center mt-4">
          <span className="text-brand-700" style={{ fontFamily: garamond.style.fontFamily }}>
            Don't have an account?{' '}
            <Button
              type="link"
              onClick={onSwitchToRegister}
              className="hover:!underline hover:!underline-offset-1"
              style={{ color: '#526f4d', padding: 0, fontFamily: garamond.style.fontFamily }}
            >
              Register
            </Button>
          </span>
        </div>
      )}
    </Form>
  );
};

export default LoginForm;
