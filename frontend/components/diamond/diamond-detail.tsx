"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button, message, Modal } from "antd";
import ShreejiLoader from "../common/loader";
import { garamond } from "@/src/common/helper";
import { useRouter, useSearchParams } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { IoHeart } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import Navbar from "../common/navbar";
import Footer from "../common/footer";
import { diamondAPI, Diamond } from "@/src/services/diamond.api";
import LoginModal from "../auth/LoginModal";
import { useWishlist } from "@/src/hooks/useWishlist";

const DiamondDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const diamondId = searchParams.get("id") || "";
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isWishlisting, toggleWishlist } = useWishlist();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch diamond details
  useEffect(() => {
    const fetchDiamond = async () => {
      if (!diamondId) return;
      try {
        setLoading(true);
        const data = await diamondAPI.getDiamondById(diamondId);
        setDiamond(data);
      } catch (error) {
        console.error("Failed to fetch diamond:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiamond();
  }, [diamondId]);

  const handleDesignInquiry = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsLoading(true);

    if (!diamond) return;

    try {
      // Get user data from local storage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      if (!userData.id) {
        throw new Error("User information not found. Please login again.");
      }

      const designRequest = {
        inquiresFor: [diamond.name],
        description: `Inquiry for Diamond: ${diamond.name} (${diamond.sku})`,
        referenceImages: [],
        referenceLinks: [],
        title: `Inquiry for ${diamond.name}`,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        countryCode: userData.countryCode || "+91",
        mobile: userData.mobile || "",
        streetAddress: userData.address || "",
        city: userData.city || "",
        postalCode: userData.postalCode || "",
        country: userData.country || "India",
      };

      const response = await diamondAPI.submitDesignRequest(designRequest);

      if (response.success) {
        message.success("Inquiry submitted successfully");
        setIsConfirmModalVisible(false);
      }
    } catch (error: any) {
      console.error("Error submitting design inquiry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInquiryClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsConfirmModalVisible(true);
  };

  const handleConfirmInquiry = () => {
    setIsConfirmModalVisible(false);
    // Here you would make API call to submit inquiry
    // For now, just show success message
    setIsSuccessModalVisible(true);
  };

  const handleWishlistChange = (isWishlisted: boolean) => {
    if (diamond) {
      setDiamond({ ...diamond, isWishlisted, isFavorite: isWishlisted });
    }
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!diamond) return;

    try {
      await toggleWishlist(
        diamond.id,
        "DIAMOND",
        diamond.isWishlisted || diamond.isFavorite,
      );
      setDiamond({
        ...diamond,
        isWishlisted: !diamond.isWishlisted,
        isFavorite: !diamond.isFavorite,
      });
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  const getShapeImage = (shape: string) => {
    const shapeImages: Record<string, string> = {
      ROUND: "/assets/diamond/ROUND.svg",
      PRINCESS: "/assets/diamond/PRINCESS.svg",
      CUSHION: "/assets/diamond/CUSHION.svg",
      EMERALD: "/assets/diamond/EMERALD.svg",
      ASSCHER: "/assets/diamond/ASSCHER.svg",
      MARQUISE: "/assets/diamond/MARQUISE.svg",
      OVAL: "/assets/diamond/OVAL.svg",
      RADIANT: "/assets/diamond/RADIANT.svg",
      PEAR: "/assets/diamond/PEAR.svg",
      HEART: "/assets/diamond/HEART.svg",
      CB: "/assets/diamond/CB.svg",
    };
    return shapeImages[shape] || "/assets/diamond/other.jpeg";
  };

  if (loading) {
    return (
      <div className={`w-full min-h-screen bg-brand-50 ${garamond.className}`}>
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
          <div className="flex justify-center items-center h-screen">
            <ShreejiLoader size="small" fullScreen={false} text="Loading..." />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!diamond) {
    return (
      <div className={`w-full min-h-screen bg-brand-50 ${garamond.className}`}>
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
          <div className="text-center">
            <h2 className="text-xl font-medium text-brand-900 mb-4">
              Diamond not found
            </h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen bg-brand-50 ${garamond.className}`}>
      {/* Navbar */}
      <Navbar />

      {/* Back Button */}
      <div className="md:px-8 md:py-4 px-4 py-2">
        <Button
          type="text"
          icon={<IoArrowBack />}
          onClick={() => router.back()}
          className={`flex items-center text-brand-700 hover:text-brand-900 ${garamond.className}`}
        >
          Back to Results
        </Button>
      </div>

      {/* Main Content */}
      <div
        className={`flex justify-center items-center w-full min-h-[calc(100vh-160px)] py-4 md:py-8 ${garamond.className}`}
      >
        <div className="bg-white rounded-lg shadow-lg md:w-[70vw] w-[full] md:mx-4 mx-2 p-8 relative">
          {/* Heart Icon - Top Right */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleWishlistClick}
              disabled={isWishlisting}
              className="inline-flex items-center justify-center p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              aria-label={
                (diamond?.isFavorite ?? diamond?.isWishlisted)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              {(diamond?.isFavorite ?? diamond?.isWishlisted) ? (
                <IoHeart className="w-6 h-6 text-red-500 fill-current" />
              ) : (
                <IoHeartOutline className="w-6 h-6 text-brand-400 hover:text-red-500 transition-colors" />
              )}
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-lg font-semibold text-brand-900 mb-6">
              DETAILS
            </h1>

            {/* Diamond Media Section */}
            <div className="mb-6">
              {/* Video Section */}
              {(() => {
                try {
                  const videosStr =
                    typeof diamond.videos === "object"
                      ? JSON.stringify(diamond.videos)
                      : "[]";
                  const videos = JSON.parse(videosStr);
                  const validVideos = videos.filter(
                    (v: string | null) => v !== null && v !== "",
                  );
                  if (validVideos.length > 0) {
                    const videoUrl = validVideos[0];

                    // Check if the URL is a direct video file or a webpage
                    const isDirectVideoUrl = /\.(mp4|webm|ogg|mov|avi)$/i.test(videoUrl);

                    if (isDirectVideoUrl) {
                      // Direct video file - use video element
                      return (
                        <div className="flex justify-center mb-4">
                          <div className="w-full max-w-md">
                            <video
                              src={videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-auto rounded-lg shadow-md"
                              onError={(e) => {
                                console.error("Video loading error:", e);
                              }}
                            />
                          </div>
                        </div>
                      );
                    } else {
                      // Webpage URL - embed in iframe
                      return (
                        <div className="flex justify-center mb-4 w-full">
                          <div className="aspect-video rounded-lg shadow-md overflow-hidden h-full w-full max-w-md">
                            <iframe
                              src={videoUrl}
                              className="!w-full !h-full border-0"
                              title="Diamond Video"
                              allowFullScreen
                              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              onError={(e) => {
                                console.error("Iframe loading error:", e);
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  }
                } catch (e) {
                  console.error("Error parsing videos:", e);
                }
                return null;
              })()}

              {/* Images Section */}
              {(() => {
                try {
                  let images;
                  // Handle both string and array types for diamond.images
                  if (typeof diamond.images === "string") {
                    images = JSON.parse(diamond.images);
                  } else if (Array.isArray(diamond.images)) {
                    images = diamond.images;
                  } else {
                    images = [];
                  }

                  const validImages = images.filter(
                    (img: string | null) => img !== null && img !== "",
                  );

                  if (validImages.length > 0) {
                    return (
                      <div className="flex justify-center mb-4">
                        <div className="grid grid-cols-1 gap-3 max-w-md">
                          {validImages.map((img: string, idx: number) => (
                            <div key={`${img}-${idx}`} className="relative aspect-square">
                              <Image
                                src={img}
                                alt={`${diamond.name} - Image ${idx + 1}`}
                                width={200}
                                height={200}
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover rounded-lg shadow-md w-full h-full"
                                onError={(e) => {
                                  console.error("Image load error:", img, e);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex justify-center mb-4">
                        {/* <div className="relative w-48 h-48">
                          <Image
                            src={getShapeImage(diamond.shape)}
                            alt={diamond.name}
                            fill
                            // width={192}
                            // height={192}
                            className="object-contain"
                          />
                        </div> */}
                      </div>
                    );
                  }
                } catch (e) {
                  console.error("Error parsing images:", e);
                  // Fallback to shape image on error
                  return (
                    ""
                    // <div className="flex justify-center mb-4">
                    //   <div className="relative w-48 h-48">
                    //     <Image
                    //       src={getShapeImage(diamond.shape)}
                    //       alt={diamond.name}
                    //       fill
                    //       width={192}
                    //       height={192}
                    //       className="object-contain"
                    //     />
                    //   </div>
                    // </div>
                  );
                }
              })()}
            </div>

            {/* Diamond Name and Price */}
            <h2 className="text-lg font-medium text-brand-900 mb-2">
              {diamond.name}
            </h2>
            <p className="text-sm text-brand-700 mb-6">
              <span className="font-medium">
                ${diamond.price.toLocaleString()}
              </span>
              <span className="mx-2 text-brand-400">|</span>
              <span>Price/Carat: ${diamond.rap.toLocaleString()}</span>
            </p>
          </div>

          {/* Specifications */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Diamond Type:</span>
              <span className="text-sm text-brand-700">
                {diamond.gemOrigin === "LAB_GROWN" ? "Lab-Grown" : "Natural"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Cut:</span>
              <span className="text-sm text-brand-700">{diamond.shape}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Carat:</span>
              <span className="text-sm text-brand-700">
                {diamond.weight.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Color:</span>
              <span className="text-sm text-brand-700">{diamond.color ? diamond.color : "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Clarity:</span>
              <span className="text-sm text-brand-700">{diamond.clarity}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Cut Grade:</span>
              <span className="text-sm text-brand-700">
                {diamond.cut || "None"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Symmetry:</span>
              <span className="text-sm text-brand-700">
                {diamond.symmetry || "None"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Polish:</span>
              <span className="text-sm text-brand-700">
                {diamond.polish || "None"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Lab:</span>
              <span className="text-sm text-brand-700">
                {diamond.lab || "None"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Certificate Number:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-700">
                  {diamond.certificateNo || "None"}
                </span>
                {diamond.certificateUrl && (
                  <a
                    href={diamond.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-600 hover:text-brand-800 underline"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Measurements:</span>
              <span className="text-sm text-brand-700">
                {diamond.length && diamond.width && diamond.height
                  ? `${diamond.length} × ${diamond.width} × ${diamond.height}`
                  : "None"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Table Width %:</span>
              <span className="text-sm text-brand-700">
                {diamond.totalWidthInPercentage || "None"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Total Depth %:</span>
              <span className="text-sm text-brand-700">
                {diamond.totalDepthInPercentage || "None"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Girdle:</span>
              <span className="text-sm text-brand-700">
                {diamond.girdle || "None"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-800">Fluorescence:</span>
              <span className="text-sm text-brand-700">
                {diamond.fluorescence || "None"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-4 w-full mt-6">
            {/* Inquiry Button */}
            <Button
              type="primary"
              size="large"
              className={`!rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner flex-1 max-w-[300px] ${garamond.className}`}
              onClick={handleInquiryClick}
            >
              INQUIRY
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Inquiry"
        open={isConfirmModalVisible}
        footer={null} // 🔹 disables default OK/Cancel buttons
        onCancel={() => setIsConfirmModalVisible(false)}
        className={garamond.className}
        centered
      >
        <p>Are you sure you want to submit an inquiry for this diamond?</p>

        <div className="mt-4 p-3 bg-brand-50 rounded">
          <p className="font-medium">{diamond.name}</p>
          <p className="text-sm text-brand-700">
            USD {diamond.price.toLocaleString()}
          </p>
        </div>

        {/* 🔹 Custom Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsConfirmModalVisible(false)}
            className="px-4 py-2 !rounded-full border border-brand-200 hover:bg-brand-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <Button
            onClick={handleDesignInquiry}
            loading={isLoading}
            className={`!px-4 !py-2 !h-10 !rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner ${garamond.className}`}
          >
            Confirm
          </Button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        title="Inquiry Submitted"
        open={isSuccessModalVisible}
        footer={null} // 🔹 Remove default footer
        onCancel={() => setIsSuccessModalVisible(false)}
        className={garamond.className}
        centered
      >
        <p>Your inquiry has been submitted successfully!</p>
        <p className="mt-2 text-brand-700">
          Our admin team will get back to you soon.
        </p>

        {/* 🔹 Custom Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              setIsSuccessModalVisible(false);
              router.back();
            }}
            className="px-4 py-2 !rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner"
          >
            OK
          </button>
        </div>
      </Modal>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          router.push("/register");
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DiamondDetail;
