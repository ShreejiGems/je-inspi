import { Suspense } from 'react';
import ProductDetail from "@/components/jewellery/product-detail";
import Loader from "@/components/common/loader";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductDetail />
    </Suspense>
  );
}
