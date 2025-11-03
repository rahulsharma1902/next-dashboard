import { Metadata } from "next";

import ReviewEdit from '../../../../../components/admin-dashboard/review/ReviewEdit'


export default function ReviewEditOverviewPage() {
  return (
    <>
    <ReviewEdit />
    </>

  )
}
export const metadata = {
  title: 'Review Edit System',
  description: 'Review Edit In your account to manage your dashboard.'
};
