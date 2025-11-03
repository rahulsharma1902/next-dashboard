import { Metadata } from "next";

import BrandDetail from '../../../../components/admin-dashboard/brand/BrandDetail'


export default function BrandsEditOverviewPage() {
  return (
    <>
      <BrandDetail />
    </>

  )
}
export const metadata = {
  title: 'Brand Edit System',
  description: 'Brand Edit In your account to manage your dashboard.'
};
