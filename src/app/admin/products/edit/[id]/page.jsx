import { Metadata } from "next";

import ProductEdit from '../../../../../components/admin-dashboard/product/ProductEdit'


export default function ProductEditOverviewPage() {
  return (
    <>
    <ProductEdit />
    </>

  )
}
export const metadata = {
  title: 'Product Edit System',
  description: 'Product Edit In your account to manage your dashboard.'
};
