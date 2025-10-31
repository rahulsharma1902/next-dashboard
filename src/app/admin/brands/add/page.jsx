import { Metadata } from "next";

import BrandAdd from '../../../../components/admin-dashboard/brand/BrandAdd'


export default function BrandsAddPage() {
  return (
    <>
    <BrandAdd />
    </>

  )
}
export const metadata = {
  title: 'BrandsAddPage',
  description: 'Brands Add to your account to manage your dashboard.'
};
