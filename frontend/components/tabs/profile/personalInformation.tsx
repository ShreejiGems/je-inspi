"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { message } from "antd";
import Loader from "../../common/loader";
import { authAPI, UpdateProfileRequest } from "../../../src/services/auth.api";

type UserData = {
  id?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  countryCode?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  bussinessType?: string;
  companyName?: string;
  companyNumber?: string;
  website?: string;
  discount?: number;
  paymentMode?: string;
  paymentCycle?: number;
  registrationCopyType?: string;
  registrationCopyImage?: string;
};

export default function PersonalInformation() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
          const data = JSON.parse(userDataStr);
          setUserData(data);
          setFormData(data);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original user data
    setFormData({
      ...userData,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle mobile number formatting
    if (name === "mobile") {
      // If the mobile number already contains +, don't append country code
      if (value.startsWith("+")) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          countryCode: "", // Clear country code if mobile has +
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare update payload - only send first name, last name, and website for now
      const updatePayload: UpdateProfileRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        website: formData.website,
      };

      // Call the update profile API
      const response = await authAPI.updateProfile(updatePayload);
      
      // Update local storage with the new user data
      const updatedUserData = { ...userData, ...formData };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      setIsEditing(false);

      // Show success message
      message.success(response.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const renderField = (
    label: string,
    value: string | number | undefined,
    name: keyof UserData,
    editable: boolean = true
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-brand-600 mb-1">
        {label}
      </label>
      {isEditing && editable ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-brand-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#526f4d]"
        />
      ) : (
        <div className="text-brand-900">{value || "-"}</div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm md:p-6 p-3">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-brand-900">
          Personal Information
        </h2>
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="flex items-center text-[#526f4d] hover:text-[#526f4d] md:text-md text-sm rounded border border-[#526f4d] md:px-4 md:py-2 px-2 py-1 gap-1"
          >
            <FiEdit2 className="mr-1 md:block hidden" /> Edit
          </button>
        ) : (
          <div className="space-x-2 flex">
            <button
              onClick={handleCancelEdit}
              className="md:px-4 md:py-2 px-2 py-1 text-sm text-brand-700 hover:bg-brand-50 rounded border border-brand-200 cursor-pointer flex items-center gap-1"
            >
              <FiX className="mr-1 md:block hidden" /> Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="md:px-4 md:py-2 px-2 py-1 text-sm bg-[#526f4d] text-white rounded hover:bg-[#526f4d] disabled:opacity-50 cursor-pointer flex items-center gap-1"
            >
              <FiSave className="mr-1 md:block hidden" />
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <div className="border-b pb-6 border-[#526f4d]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("First Name", isEditing ? formData.firstName : userData.firstName, "firstName", true)}
            {renderField("Last Name", isEditing ? formData.lastName : userData.lastName, "lastName", true)}
            {renderField("Email", userData.email, "email", false)}
            {renderField(
              "Mobile",
              userData.mobile
                ? userData.mobile.startsWith("+")
                  ? userData.mobile
                  : `${userData.countryCode || ""} ${userData.mobile}`
                : "-",
              "mobile",
              false
            )}
            {renderField("Address", userData.address, "address", false)}
            {renderField("City", userData.city, "city", false)}
            {renderField("Country", userData.country, "country", false)}
            {renderField("Postal Code", userData.postalCode, "postalCode", false)}
          </div>
        </div>

        {/* Business Information */}
        <div className="border-b pb-6 border-[#526f4d]">
          <h3 className="text-lg font-medium text-brand-900 mb-6">
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField(
              "Business Type",
              userData.bussinessType,
              "bussinessType",
              false
            )}
            {renderField("Company Name", userData.companyName, "companyName", false)}
            {renderField(
              "Company Number",
              userData.companyNumber,
              "companyNumber",
              false
            )}
            {renderField("Website", isEditing ? formData.website : userData.website, "website", false)}
            {renderField(
              "Discount",
              userData.discount ? `${userData.discount}%` : "-",
              "discount",
              false
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h3 className="text-lg font-medium text-brand-900 mb-6">
            Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("Payment Mode", userData.paymentMode, "paymentMode", false)}
            {renderField(
              "Payment Cycle",
              userData.paymentCycle ? `${userData.paymentCycle} days` : "-",
              "paymentCycle",
              false
            )}
            {renderField(
              "Registration Copy Type",
              userData.registrationCopyType,
              "registrationCopyType",
              false
            )}
            {userData.registrationCopyImage && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-brand-600 mb-1">
                  Registration Copy
                </label>
                <a
                  href={userData.registrationCopyImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#526f4d] hover:underline"
                >
                  View Document
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
