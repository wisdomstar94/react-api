import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-api test',
  description: 'react-api test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
