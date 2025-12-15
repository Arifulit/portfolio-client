'use client';

import { useEffect } from 'react';

interface BodyWrapperProps {
  children: React.ReactNode;
}

export default function BodyWrapper({ children }: BodyWrapperProps) {
  useEffect(() => {
    // Remove any browser extension attributes that cause hydration issues
    const body = document.body;
    if (body.hasAttribute('cz-shortcut-listen')) {
      body.removeAttribute('cz-shortcut-listen');
    }
  }, []);

  return <>{children}</>;
}
