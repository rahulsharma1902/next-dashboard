// app/layout.jsx
import './globals.css';
import ClientProviders from './ClientProviders';

export const metadata = {
  title: 'Advanced Next Dashboard',
  description: 'Modern dashboard with advanced features',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}