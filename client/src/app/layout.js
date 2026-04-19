import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'San Gabriel Solutions | Collaboration Portal [v1.0.1]',
  description: 'A high-performance project management and collaboration portal for San Gabriel Solutions. Secure, scalable, and professional.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <div className="mesh-gradient"></div>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
