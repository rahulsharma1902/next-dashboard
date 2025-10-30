import { Metadata } from "next";

import BrandView from '../../../component/admin-dashboard/brand/BrandView'


export default function BrandsOverviewPage() {
  return (
    <>
    <BrandView />
    </>

  )
}
export const metadata = {
  title: 'Login System',
  description: 'Login to your account to manage your dashboard.'
};
