import { Metadata } from "next";

import LoginPage from '../../components/auth/login/LoginPage'


export default function Login() {
  return (
    <>
    <LoginPage />
    </>

  )
}
export const metadata = {
  title: 'Login System',
  description: 'Login to your account to manage your dashboard.'
};
