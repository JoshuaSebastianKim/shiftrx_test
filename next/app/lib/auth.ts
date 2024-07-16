import { cookies } from 'next/headers';
import axios from './axios';

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const response = await axios.post('/api/auth/login', { email, password });

  cookies().set('access_token', response.data.accessToken, {
    maxAge: 60 * 60 * 24,
  });
}

export async function register(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const response = await axios.post('/api/auth/sign-up', { email, password });

  cookies().set('access_token', response.data.accessToken, {
    maxAge: 60 * 60 * 24,
  });
}

export async function getSession() {
  const session = cookies().get('access_token')?.value;
  if (!session) return null;
  return session;
}
