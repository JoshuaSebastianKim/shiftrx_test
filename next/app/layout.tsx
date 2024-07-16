import { Inter } from 'next/font/google';
import Header from './ui/Header';
import { getUserProfile } from './lib/user';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserProfile();

  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={`${inter.className} h-full`}>
        <Header user={user} />
        <main className="bg-white p-8">{children}</main>
      </body>
    </html>
  );
}
