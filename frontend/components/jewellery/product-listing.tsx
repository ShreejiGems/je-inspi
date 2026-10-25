"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PRODUCT_LIST } from "@/src/libs/constants"; // adjust the path
import { IoHeartOutline } from "react-icons/io5";
import { IoHeart } from "react-icons/io5";
import { garamond } from "@/src/common/helper";

const JewelleryProductList = () => {
    const router = useRouter();

    const handleProductClick = (productId: string) => {
        router.push(`/jewellery/product-detail?id=${productId}`);
    };

    return (
        <div className={`grid grid-cols-4 border-1 mx-2 ${garamond.className}`}>
            {PRODUCT_LIST.map((product) => {
                if (product.value === "Zig-prodct") {
                    return (
                        <div
                            key={product.value}
                            className="col-span-2 row-span-2 relative overflow-hidden"
                        >
                            <Image
                                src={product.image}
                                alt={product.type}
                                width={600}
                                height={600}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    );
                }


                return (
                    <div
                        key={product.value}
                        className="border p-4 flex flex-col justify-center items-start text-center relative cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        onClick={() => handleProductClick(product.value)}
                    >
                        {/* Wishlist Icon */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent product click when clicking wishlist
                                // Handle wishlist toggle logic here
                            }}
                        >
                            {product.isInCart
                                ? <IoHeart className="absolute h-[25px] w-[25px] top-3 right-3 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
                                : <IoHeartOutline className="absolute h-[25px] w-[25px] top-3 right-3 text-brand-900 cursor-pointer hover:scale-110 transition-transform" />
                            }
                        </div>

                        {/* Product Image */}
                        <Image
                            src={product.image}
                            alt={product.type}
                            width={100}
                            height={100}
                            className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                        />

                        {/* Product Details */}
                        <div className="mt-2 text-start">
                            <h3 className="uppercase text-[28px] text-[#526f4d] font-[500]">{product.type}</h3>
                            <p className="text-[16px] text-brand-700">{product.skuId || "SKU ID"}</p>
                            <p className="text-[28px] font-[400]">{product.price || ""}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default JewelleryProductList;
