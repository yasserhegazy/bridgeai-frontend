// app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) redirect('/auth/login');
  else redirect('/dashboard');

  return null;
}