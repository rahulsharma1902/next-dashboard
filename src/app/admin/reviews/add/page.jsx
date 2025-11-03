import { Metadata } from "next";

import ReviewAdd from '../../../../components/admin-dashboard/review/ReviewAdd'


export default function ReviewAddPage() {
  return (
    <>
    <ReviewAdd />
    </>

  )
}
export const metadata = {
  title: 'Review AddPage',
  description: 'Review Add to your account to manage your dashboard.'
};
