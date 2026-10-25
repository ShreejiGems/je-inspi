"use client";

import { Suspense, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import PersonalInformation from "./personalInformation";
import ProfileSidebar from "./sidebarForTab";
import Loader from "../../common/loader";
import { garamond } from "@/src/common/helper";

const Profile = () => {
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
      <div
        className={`flex-1 bg-brand-50 py-8 ${
          hoveredItem !== null ? "blur-[1px] bg-brand-200" : ""
        }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-80 flex-shrink-0">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm md:p-6 p-0 border-2 border-[#526f4d]">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-64">
                    <Loader />
                  </div>
                }
              >
                <PersonalInformation />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
