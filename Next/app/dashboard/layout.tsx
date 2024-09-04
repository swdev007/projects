'use client';
import HeaderDashboard from '@/components/HeaderDashboard/HeaderDashboard';
import AuthCheck from '@/components/Wrapper/AuthCheck';
import React from 'react';

export default function layout({ children }: { children: any }) {
  return (
    <AuthCheck>
      <>
        <HeaderDashboard />
        {children}
      </>
    </AuthCheck>
  );
}
