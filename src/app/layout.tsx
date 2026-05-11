import './globals.css';
import { CanvasWrapper } from '@/components/canvas/CanvasWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}