import { Metadata } from "next";

import LoginForm from '@/component/auth/login/login'


export default function Login() {
  return (
    <>
    <LoginForm />
    </>

  )
}
export const metadata = {
  title: 'Login System',
  description: 'Login to your account to manage your dashboard.'
};
