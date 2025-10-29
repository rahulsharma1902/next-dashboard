'use client';
import useAuthStore from '@/store/useAuthStore';
import { axiosWrapper } from '@/utils/api';
import { API_URL } from '@/utils/apiUrl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (email, password) => {
    console.log('Login button clicked');
    try {
      const res = await axiosWrapper('post', API_URL.LOGIN_USER, { email, password });
      console.log('Response received:', res);
      setAuth(res.user, res.token);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.log('Error caught:', err);
      toast.error(err?.message || 'Login failed');
    }
  };
  

  return (
    <button onClick={() => handleLogin('rahul@example.com', '123456')}>
      Login Here
    </button>
  );
}
