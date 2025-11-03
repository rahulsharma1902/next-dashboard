import { Metadata } from "next";

import ProductView from '../../../components/admin-dashboard/product/ProductView'


export default function ProductsOverviewPage() {
  return (
    <>
    <ProductView />
    </>

  )
}
export const metadata = {
  title: 'Product Overview',
  description: 'View Your all product here.'
};
