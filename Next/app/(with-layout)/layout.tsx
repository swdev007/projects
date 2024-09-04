import type { Metadata } from 'next';
import { Providers } from '../_lib/GlobalRedux/provider';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import HeaderfooterWrapper from '@/components/Wrapper/HeaderFooterWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderfooterWrapper>
      <>{children}</>
    </HeaderfooterWrapper>
  );
}
