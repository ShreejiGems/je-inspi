import { Suspense } from 'react';
import DiamondDetail from '@/components/diamond/diamond-detail';
import Loader from '@/components/common/loader';

export default function DiamondDetailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <DiamondDetail />
    </Suspense>
  );
}