'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Alert, Button, Form, Input, message } from 'antd';
import { authAPI } from '@/src/services/auth.api';
import { utilityHelper } from '@/src/libs/helper';

export default function ResetPasswordForm() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const captured = useRef(false);
  useEffect(() => {
    if (captured.current) return;
    captured.current = true;
    const value = new URLSearchParams(window.location.hash.slice(1)).get('token');
    setToken(value && /^[a-f0-9]{64}$/.test(value) ? value : null);
    // Keep the token only in component memory, never browser storage or history.
    window.history.replaceState(null, '', window.location.pathname);
    setReady(true);
  }, []);
  async function submit({ password }: { password: string }) {
    if (!token) return;
    setLoading(true);
    try {
      await authAPI.changePassword({ token, password });
      setToken(null);
      setDone(true);
    } catch (error) {
      message.error(utilityHelper.formatErrorMessage(error));
    } finally { setLoading(false); }
  }
  if (!ready) return <p>Loading…</p>;
  if (done) return <><Alert type="success" message="Password updated. Sign in with your new password." /><Link href="/login">Back to login</Link></>;
  if (!token) return <><Alert type="error" message="This reset link is invalid. Request a new link." /><Link href="/login">Back to login</Link></>;
  return <Form layout="vertical" onFinish={submit}>
    <Form.Item name="password" label="New password" rules={[{ required: true }, { min: 12 }, {
      validator: (_, value) => !value || new TextEncoder().encode(value).length <= 72
        ? Promise.resolve() : Promise.reject(new Error('Password must be at most 72 UTF-8 bytes.')),
    }]}>
      <Input.Password autoComplete="new-password" maxLength={72} />
    </Form.Item>
    <p className="mb-4">Use at least 12 characters.</p>
    <Form.Item name="confirmPassword" label="Confirm password" dependencies={['password']} rules={[
      { required: true }, ({ getFieldValue }) => ({ validator: (_, value) =>
        value === getFieldValue('password') ? Promise.resolve() : Promise.reject(new Error('Passwords do not match.')) }),
    ]}><Input.Password autoComplete="new-password" maxLength={72} /></Form.Item>
    <Button htmlType="submit" type="primary" loading={loading} block>Reset password</Button>
  </Form>;
}
