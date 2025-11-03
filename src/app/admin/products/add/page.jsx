import { Metadata } from "next";

import ProductAdd from '../../../../components/admin-dashboard/product/ProductAdd'


export default function ProductsAddPage() {
  return (
    <>
    <ProductAdd />
    </>

  )
}
export const metadata = {
  title: 'ProductsAddPage',
  description: 'Product Add to your account to manage your dashboard.'
};
