import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'San Gabriel Solutions | Collaboration Portal',
  description: 'Secure project collaboration portal for San Gabriel Solutions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="mesh-gradient"></div>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
