"use client";
import React from "react";
import { Checkbox, Input } from "antd";
import CustomSlider from "./custom-slider";
import { garamond } from "@/src/common/helper";
import { IoInformationCircleOutline } from "react-icons/io5";
import { DiamondSearchParams } from "@/src/services/diamond.api";

interface AdvancedFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  isVisible: boolean;
  searchParams: DiamondSearchParams | null;
}

const FLUORESCENCE_ORDER = ["NON", "FNT", "VSL", "SLT", "MED", "STG", "VSTG"];

const FLUORESCENCE_LABELS: Record<string, string> = {
  NON: "None",
  FNT: "Faint",
  SLT: "Slight",
  VSL: "Very Slight",
  MED: "Medium",
  STG: "Strong",
  VSTG: "Very Strong",
};

const GRADE_ORDER = ["EX", "VG", "GD", "FR"];

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  setFilters,
  isVisible,
  searchParams,
}) => {
  if (!isVisible || !searchParams) return null;

  const handleMultiSelectToggle = (category: string, value: string) => {
    const currentValues = filters[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    setFilters({ ...filters, [category]: newValues });
  };

  // Helper function to get predefined fluorescence values
  const getPredefinedFluorescence = () => {
    return ["FNT", "MED", "NON", "SLT", "STG", "VSL", "VSTG"];
  };

  // Helper function to get additional fluorescence beyond predefined ones
  const getAdditionalFluorescence = () => {
    if (!searchParams) return [];
    const predefinedFluorescence = getPredefinedFluorescence();
    return searchParams.fluorescence.filter(
      (fluor) => !predefinedFluorescence.includes(fluor),
    );
  };

  // Helper function to check if "Other" option should be shown for fluorescence
  const shouldShowOtherFluorescenceOption = () => {
    return getAdditionalFluorescence().length > 0;
  };

  // Helper function to handle fluorescence toggle with "Other" logic
  const handleFluorescenceToggle = (fluor: string) => {
    if (fluor === "OTHER") {
      const otherFluorescence = getAdditionalFluorescence();
      const hasOtherSelected = filters.fluorescence.some((f: string) => otherFluorescence.includes(f));

      let newFluorescence;
      if (hasOtherSelected) {
        newFluorescence = filters.fluorescence.filter(
          (f: string) => !otherFluorescence.includes(f),
        );
      } else {
        newFluorescence = [
          ...filters.fluorescence.filter((f: string) => !otherFluorescence.includes(f)),
          ...otherFluorescence,
        ];
      }
      setFilters({ ...filters, fluorescence: newFluorescence });
    } else {
      const newFluorescence = filters.fluorescence.includes(fluor)
        ? filters.fluorescence.filter((f: string) => f !== fluor)
        : [...filters.fluorescence, fluor];
      setFilters({ ...filters, fluorescence: newFluorescence });
    }
  };

  // Helper function to get predefined polish grades
  const getPredefinedPolish = () => {
    return GRADE_ORDER;
  };

  // Helper function to get additional polish beyond predefined ones
  const getAdditionalPolish = () => {
    if (!searchParams) return [];
    const predefinedPolish = getPredefinedPolish();
    return searchParams.polish.filter(
      (polish) => !predefinedPolish.includes(polish),
    );
  };

  // Helper function to check if "Other" option should be shown for polish
  const shouldShowOtherPolishOption = () => {
    return getAdditionalPolish().length > 0;
  };

  // Helper function to handle polish toggle with "Other" logic
  const handlePolishToggle = (polish: string) => {
    if (polish === "OTHER") {
      const otherPolish = getAdditionalPolish();
      const hasOtherSelected = filters.polish.some((p: string) => otherPolish.includes(p));

      let newPolish;
      if (hasOtherSelected) {
        newPolish = filters.polish.filter(
          (p: string) => !otherPolish.includes(p),
        );
      } else {
        newPolish = [
          ...filters.polish.filter((p: string) => !otherPolish.includes(p)),
          ...otherPolish,
        ];
      }
      setFilters({ ...filters, polish: newPolish });
    } else {
      const newPolish = filters.polish.includes(polish)
        ? filters.polish.filter((p: string) => p !== polish)
        : [...filters.polish, polish];
      setFilters({ ...filters, polish: newPolish });
    }
  };

  // Helper function to get predefined symmetry grades
  const getPredefinedSymmetry = () => {
    return GRADE_ORDER;
  };

  // Helper function to get additional symmetry beyond predefined ones
  const getAdditionalSymmetry = () => {
    if (!searchParams) return [];
    const predefinedSymmetry = getPredefinedSymmetry();
    return searchParams.symmetry.filter(
      (symmetry) => !predefinedSymmetry.includes(symmetry),
    );
  };

  // Helper function to check if "Other" option should be shown for symmetry
  const shouldShowOtherSymmetryOption = () => {
    return getAdditionalSymmetry().length > 0;
  };

  // Helper function to handle symmetry toggle with "Other" logic
  const handleSymmetryToggle = (symmetry: string) => {
    if (symmetry === "OTHER") {
      const otherSymmetry = getAdditionalSymmetry();
      const hasOtherSelected = filters.symmetry.some((s: string) => otherSymmetry.includes(s));

      let newSymmetry;
      if (hasOtherSelected) {
        newSymmetry = filters.symmetry.filter(
          (s: string) => !otherSymmetry.includes(s),
        );
      } else {
        newSymmetry = [
          ...filters.symmetry.filter((s: string) => !otherSymmetry.includes(s)),
          ...otherSymmetry,
        ];
      }
      setFilters({ ...filters, symmetry: newSymmetry });
    } else {
      const newSymmetry = filters.symmetry.includes(symmetry)
        ? filters.symmetry.filter((s: string) => s !== symmetry)
        : [...filters.symmetry, symmetry];
      setFilters({ ...filters, symmetry: newSymmetry });
    }
  };

  const handleTableWidthChange = (value: [number, number]) => {
    setFilters({
      ...filters,
      minWidthPercentage: value[0],
      maxWidthPercentage: value[1],
    });
  };

  const handleDepthChange = (value: [number, number]) => {
    setFilters({
      ...filters,
      minDepthPercentage: value[0],
      maxDepthPercentage: value[1],
    });
  };

  // const mapGradeLabel = (grade: string) => {
  //   const mapping: Record<string, string> = {
  //     EX: "Excellent",
  //     VG: "Very Good",
  //     GD: "Good",
  //     FR: "Fair",
  //   };
  //   return mapping[grade] || grade;
  // };

  const mapGradeLabel = (grade: string) => {
    switch (grade) {
      case "EX":
        return "Excellent";
      case "VG":
        return "Very Good";
      case "GD":
        return "Good";
      case "FR":
        return "Fair";
      case "PR":
        return "Poor";
      default:
        return grade;
    }
  };

  return (
    <div className={`w-full space-y-8 border-t pt-5 ${garamond.className}`}>
      {/* Fluorescence and Table Width Row */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-12">
        {/* Fluorescence */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium text-brand-900">
              Fluorescence
            </h3>
            {/* <IoInformationCircleOutline className="text-brand-400 cursor-pointer text-lg" /> */}
          </div>
          <div className="flex flex-wrap gap-3">
            {getPredefinedFluorescence()
              .sort((a, b) => FLUORESCENCE_ORDER.indexOf(a) - FLUORESCENCE_ORDER.indexOf(b))
              .map((fluor) => (
                <Checkbox
                  key={fluor}
                  checked={filters.fluorescence?.includes(fluor)}
                  onChange={() => handleFluorescenceToggle(fluor)}
                  className={`text-sm ${garamond.className}`}
                >
                  {FLUORESCENCE_LABELS[fluor] ?? fluor}
                </Checkbox>
              ))}
            {shouldShowOtherFluorescenceOption() && (
              <Checkbox
                key="OTHER"
                checked={filters.fluorescence?.some((f: string) => getAdditionalFluorescence().includes(f))}
                onChange={() => handleFluorescenceToggle("OTHER")}
                className={`text-sm ${garamond.className}`}
              >
                Other
              </Checkbox>
            )}
          </div>
        </div>

        {/* Table Width */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium text-brand-900">
              Table Width(%)
            </h3>
            {/* <IoInformationCircleOutline className="text-brand-400 cursor-pointer text-lg" /> */}
          </div>
          <div className="px-2">
            <CustomSlider
              min={0}
              max={100}
              value={[
                filters.minWidthPercentage ?? 0,
                filters.maxWidthPercentage ?? 100,
              ]}
              onChange={handleTableWidthChange}
              step={1}
              className="w-full mt-4"
            />
            <div className="flex gap-4 mt-2">
              <Input
                value={filters.minWidthPercentage || 0}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || (Number(val) <= 100)) {
                    setFilters({
                      ...filters,
                      minWidthPercentage: val === '' ? undefined : Number(val),
                    });
                  }
                }}
                className={`w-full ${garamond.className}`}
                size="small"
                placeholder="Min"
              />
              <Input
                value={filters.maxWidthPercentage || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || (Number(val) <= 100)) {
                    setFilters({
                      ...filters,
                      maxWidthPercentage: val === '' ? undefined : Number(val),
                    });
                  }
                }}
                className={`w-full ${garamond.className}`}
                size="small"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Polish and Symmetry Row */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-12">
        {/* Polish */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium text-brand-900">Polish</h3>
            {/* <IoInformationCircleOutline className="text-brand-400 cursor-pointer text-lg" /> */}
          </div>
          <div className="flex flex-wrap gap-3">
            {getPredefinedPolish()
              .sort((a, b) => GRADE_ORDER.indexOf(a) - GRADE_ORDER.indexOf(b))
              .map((polish) => (
                <Checkbox
                  key={polish}
                  checked={filters.polish?.includes(polish)}
                  onChange={() => handlePolishToggle(polish)}
                  className={`text-sm ${garamond.className}`}
                >
                  {mapGradeLabel(polish)}
                </Checkbox>
              ))}
            {shouldShowOtherPolishOption() && (
              <Checkbox
                key="OTHER"
                checked={filters.polish?.some((p: string) => getAdditionalPolish().includes(p))}
                onChange={() => handlePolishToggle("OTHER")}
                className={`text-sm ${garamond.className}`}
              >
                Other
              </Checkbox>
            )}
          </div>
        </div>

        {/* Symmetry */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium text-brand-900">Symmetry</h3>
            <IoInformationCircleOutline className="text-brand-400 cursor-pointer text-lg" />
          </div>
          <div className="flex flex-wrap gap-3">
            {getPredefinedSymmetry()
              .sort((a, b) => GRADE_ORDER.indexOf(a) - GRADE_ORDER.indexOf(b))
              .map((symmetry) => (
                <Checkbox
                  key={symmetry}
                  checked={filters.symmetry?.includes(symmetry)}
                  onChange={() => handleSymmetryToggle(symmetry)}
                  className={`text-sm ${garamond.className}`}
                >
                  {mapGradeLabel(symmetry)}
                </Checkbox>
              ))}
            {shouldShowOtherSymmetryOption() && (
              <Checkbox
                key="OTHER"
                checked={filters.symmetry?.some((s: string) => getAdditionalSymmetry().includes(s))}
                onChange={() => handleSymmetryToggle("OTHER")}
                className={`text-sm ${garamond.className}`}
              >
                Other
              </Checkbox>
            )}
          </div>
        </div>
      </div>

      {/* Depth Row */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-12">
        {/* Depth */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium text-brand-900">Depth(%)</h3>
            <IoInformationCircleOutline className="text-brand-400 cursor-pointer text-lg" />
          </div>
          <CustomSlider
            min={0}
            max={100}
            value={[
              filters.minDepthPercentage ?? 0,
              filters.maxDepthPercentage ?? 100,
            ]}
            onChange={handleDepthChange}
            step={1}
            className="w-full mt-4"
          />
          <div className="flex gap-4 mt-2">
            <Input
              value={filters.minDepthPercentage || 0}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || (Number(val) <= 100)) {
                  setFilters({
                    ...filters,
                    minDepthPercentage: val === '' ? undefined : Number(val),
                  });
                }
              }}
              className={`w-full ${garamond.className}`}
              size="small"
              placeholder="Min"
            />
            <Input
              value={filters.maxDepthPercentage || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || (Number(val) <= 100)) {
                  setFilters({
                    ...filters,
                    maxDepthPercentage: val === '' ? undefined : Number(val),
                  });
                }
              }}
              className={`w-full ${garamond.className}`}
              size="small"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
