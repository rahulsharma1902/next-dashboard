import { Metadata } from "next";

import BrandEdit from '../../../../../components/admin-dashboard/brand/BrandEdit'


export default function BrandsEditOverviewPage() {
  return (
    <>
    <BrandEdit />
    </>

  )
}
export const metadata = {
  title: 'Brand Edit System',
  description: 'Brand Edit In your account to manage your dashboard.'
};
