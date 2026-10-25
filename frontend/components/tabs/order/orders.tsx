"use client";

import { Suspense, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import OrdersList from "./orders-list";
import OrdersSidebar from "../profile/sidebarForTab";
import Loader from "../../common/loader";
import { garamond } from "@/src/common/helper";

const Orders = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hoveredItem } = useAuth();

  useEffect(() => {
    let timer: any;

    if (!isAuthenticated) {
      timer = setTimeout(() => {
        router.push("/login");
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, router, pathname]);

  return (
    <div className={`min-h-screen flex flex-col ${garamond.className}`}>
      <Navbar />
      <div className={`flex-1 bg-brand-50 py-4 md:py-8 ${hoveredItem !== null ? "blur-[1px] bg-brand-200" : ""}`}>
        <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar - Hidden on mobile, shown on md+ */}
            <div className="hidden md:block w-full md:w-[360px] flex-shrink-0">
              <OrdersSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-3 md:p-6 border-2 border-[#526f4d]">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-64">
                    <Loader />
                  </div>
                }
              >
                <OrdersList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
