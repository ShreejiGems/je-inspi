import { Suspense } from 'react';
import Jewellery from "@/components/jewellery/jewellery";
import Loader from "@/components/common/loader";

export default function JewelleryPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Jewellery />
    </Suspense>
  );
}
