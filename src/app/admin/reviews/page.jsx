import { Metadata } from "next";

import ReviewView from '../../../components/admin-dashboard/review/ReviewView'


export default function ReviewOverviewPage() {
  return (
    <>
    <ReviewView />
    </>

  )
}
export const metadata = {
  title: 'Review Overview',
  description: 'View Your all product here.'
};
