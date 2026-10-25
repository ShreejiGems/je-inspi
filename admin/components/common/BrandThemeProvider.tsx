'use client';

import { useEffect, type ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { brandTheme } from '@/src/common/brand';

export default function BrandThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Static messages and confirmation dialogs render outside the app tree.
    ConfigProvider.config({
      holderRender: (content) => (
        <ConfigProvider theme={brandTheme}>{content}</ConfigProvider>
      ),
    });
  }, []);

  return <ConfigProvider theme={brandTheme}>{children}</ConfigProvider>;
}
