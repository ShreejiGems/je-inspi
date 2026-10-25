'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { authAPI } from '@/src/services/auth.api';
import { utilityHelper } from '@/src/libs/helper';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
  verificationType: string;
}

export default function ForgotPasswordModal({ onBackToLogin }: ForgotPasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit({ email }: { email: string }) {
    setLoading(true);
    try {
      await authAPI.requestPasswordReset(email);
      setSent(true);
    } catch (error) {
      message.error(utilityHelper.formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }
  return <div>
    <Button type="link" onClick={onBackToLogin}>Back to login</Button>
    {sent ? <Alert type="success" showIcon message="Check your email"
      description="If an eligible account exists, a password reset link will be emailed shortly. The link expires in 15 minutes." /> :
      <Form layout="vertical" onFinish={submit}>
        <p className="mb-4">Enter your email address to request a password reset link.</p>
        <Form.Item name="email" label="Email address" rules={[{ required: true }, { type: 'email' }]}>
          <Input type="email" autoComplete="email" maxLength={254} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>Send reset link</Button>
      </Form>}
  </div>;
}
