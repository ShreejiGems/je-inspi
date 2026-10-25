'use client';

import React, { useEffect, useState } from 'react';
import { authUtils } from '@/src/utils/auth';
import { User } from '@/src/types/auth';
import Sidebar from '@/components/sidebar/sidebar';
import Navbar from '@/components/navbar/navbar';
import { useRouter, usePathname } from 'next/navigation';
import { Roboto } from '@/src/common/fonts';

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!authUtils.isAuthenticated()) {
      setLoading(false);
      router.push('/');
      return;
    }

    // Get user data
    const userData = authUtils.getUser();
    if (userData) {
      setUser(userData);
    }

    setLoading(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-brand-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return children;
  }

  return (
    <div className={`h-screen bg-brand-50 ${roboto.className}`}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <Navbar user={user} />

          {/* Page Content */}
          <main className="flex-1 p-6 h-[calc(100vh-76px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
