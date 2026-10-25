import type { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password | JE-Inspi',
  referrer: 'no-referrer',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <main className="min-h-screen bg-brand-50 flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white rounded-xl p-8 shadow">
      <h1 className="text-2xl mb-6 text-brand-900">Reset your password</h1>
      <ResetPasswordForm />
    </div>
  </main>;
}
