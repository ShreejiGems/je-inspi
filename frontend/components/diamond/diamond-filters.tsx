"use client";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Input, Drawer, Badge } from "antd";
import { garamond } from "@/src/common/helper";
import { DiamondSearchParams } from "@/src/services/diamond.api";
import { DIAMOND_SHAPES } from "@/src/libs/constants";
import AdvancedFilters from "./advanced-filters";
import CustomSlider from "./custom-slider";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import { GoPlus } from "react-icons/go";

interface DiamondFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  searchParams: DiamondSearchParams | null;
}

const CUT_ORDER = ["EX", "VG", "GD", "FR", "PD"];

const CLARITY_ORDER = [
  "FL",
  "IF",
  "VVS1",
  "VVS2",
  "VS1",
  "VS2",
  "SI1",
  "SI2",
  "I1",
  "I2",
];

const COLOR_ORDER = [
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O-P",
  "Q-R",
  "S-T",
  "U-V",
  "Y-Z",
  "Other",
];

const DiamondFilters: React.FC<DiamondFiltersProps> = ({
  filters,
  setFilters,
  searchParams,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceInputs, setPriceInputs] = useState({
    min: filters.price.min,
    max: filters.price.max,
  });
  const [weightInputs, setWeightInputs] = useState({
    min: filters.weight.min,
    max: filters.weight.max,
  });
  const [priceInputTexts, setPriceInputTexts] = useState({
    min: String(filters.price.min),
    max: String(filters.price.max),
  });
  const [weightInputTexts, setWeightInputTexts] = useState({
    min: Number(filters.weight.min).toFixed(2),
    max: Number(filters.weight.max).toFixed(2),
  });

  // The API updates these ranges after the filter component first mounts.
  useEffect(() => {
    setPriceInputs({ min: filters.price.min, max: filters.price.max });
    setPriceInputTexts({ min: String(filters.price.min), max: String(filters.price.max) });
  }, [filters.price.min, filters.price.max]);

  useEffect(() => {
    setWeightInputs({ min: filters.weight.min, max: filters.weight.max });
    setWeightInputTexts({
      min: Number(filters.weight.min).toFixed(2),
      max: Number(filters.weight.max).toFixed(2),
    });
  }, [filters.weight.min, filters.weight.max]);

  const handleMultiSelectToggle = (category: string, value: string) => {
    const currentValues = filters[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    setFilters({ ...filters, [category]: newValues });
  };

  const handlePriceChange = (values: [number, number]) => {
    setPriceInputs({ min: values[0], max: values[1] });
    setPriceInputTexts({
      min: String(Math.round(values[0])),
      max: String(Math.round(values[1])),
    });
    setFilters({ ...filters, price: { min: values[0], max: values[1] } });
  };

  const handleWeightChange = (values: [number, number]) => {
    setWeightInputs({ min: values[0], max: values[1] });
    setWeightInputTexts({
      min: values[0].toFixed(2),
      max: values[1].toFixed(2),
    });
    setFilters({ ...filters, weight: { min: values[0], max: values[1] } });
  };

  const clamp = (val: number, min: number, max: number) =>
    Math.min(max, Math.max(min, val));

  const handlePriceInputBlur = (field: "min" | "max") => {
    const raw = priceInputTexts[field]?.trim() ?? "";
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setPriceInputTexts({
        ...priceInputTexts,
        [field]: String(priceInputs[field]),
      });
      return;
    }
    let val = Math.round(parsed);
    val = clamp(
      val,
      searchParams!.priceRange.min,
      searchParams!.priceRange.max,
    );
    let newMin = priceInputs.min;
    let newMax = priceInputs.max;
    if (field === "min") newMin = val;
    else newMax = val;
    if (newMin > newMax) {
      if (field === "min") newMax = newMin;
      else newMin = newMax;
    }
    setPriceInputs({ min: newMin, max: newMax });
    setPriceInputTexts({ min: String(newMin), max: String(newMax) });
    setFilters({ ...filters, price: { min: newMin, max: newMax } });
  };

  const handleWeightInputBlur = (field: "min" | "max") => {
    const raw = weightInputTexts[field]?.trim() ?? "";
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setWeightInputTexts({
        ...weightInputTexts,
        [field]: Number(weightInputs[field]).toFixed(2),
      });
      return;
    }
    let val = Math.round(parsed * 100) / 100;
    val = clamp(
      val,
      searchParams!.weightRange.min,
      searchParams!.weightRange.max,
    );
    let newMin = weightInputs.min;
    let newMax = weightInputs.max;
    if (field === "min") newMin = val;
    else newMax = val;
    if (newMin > newMax) {
      if (field === "min") newMax = newMin;
      else newMin = newMax;
    }
    newMin = Math.round(newMin * 100) / 100;
    newMax = Math.round(newMax * 100) / 100;
    setWeightInputs({ min: newMin, max: newMax });
    setWeightInputTexts({ min: newMin.toFixed(2), max: newMax.toFixed(2) });
    setFilters({ ...filters, weight: { min: newMin, max: newMax } });
  };

  const handleClarityRangeChange = (values: [number, number]) => {
    if (!searchParams) return;

    const predefinedClarityGrades = getPredefinedClarityGrades();
    const additionalClarityGrades = getAdditionalClarityGrades();
    const orderedClarity = getOrderedClarity();

    // Get the selected range from ordered clarity
    const selectedClarities = orderedClarity.slice(values[0], values[1] + 1);

    // Check if "Other" should be included (if range includes "Other")
    const includesOther = selectedClarities.includes("Other");

    let finalClarities: string[] = [];

    if (includesOther) {
      // When "Other" is included, include all predefined clarities in range plus all additional clarities
      const predefinedInRange = selectedClarities.filter(
        (c) => c !== "Other" && predefinedClarityGrades.includes(c),
      );
      // Include ALL additional clarities when "Other" is selected
      finalClarities = [...predefinedInRange, ...additionalClarityGrades];
    } else {
      // Only include predefined clarities in range
      finalClarities = selectedClarities.filter((c) =>
        predefinedClarityGrades.includes(c),
      );
    }

    setFilters({ ...filters, clarity: finalClarities });
  };

  const resetFilters = () => {
    const defaultFilters = {
      shape: [],
      weight: {
        min: searchParams?.weightRange?.min || 0,
        max: searchParams?.weightRange?.max || 31,
      },
      clarity: [],
      color: [],
      cut: [],
      fluorescence: [],
      polish: [],
      symmetry: [],
      price: {
        min: searchParams?.priceRange?.min || 0,
        max: searchParams?.priceRange?.max || 4098600,
      },
      tableWidth: { min: 0, max: 100 },
      depth: { min: 0, max: 100 },
      lab: [],
      girdle: [],
    };
    setFilters(defaultFilters);
    setPriceInputs({
      min: defaultFilters.price.min,
      max: defaultFilters.price.max,
    });
    setPriceInputTexts({
      min: String(defaultFilters.price.min),
      max: String(defaultFilters.price.max),
    });
    setWeightInputs({
      min: defaultFilters.weight.min,
      max: defaultFilters.weight.max,
    });
    setWeightInputTexts({
      min: Number(defaultFilters.weight.min).toFixed(2),
      max: Number(defaultFilters.weight.max).toFixed(2),
    });
  };

  const getShapeImage = (shape: string) => {
    return `/assets/diamond/${shape}.svg`;
  };

  // Helper function to get predefined shape values
  const getPredefinedShapes = () => {
    return DIAMOND_SHAPES.map((shape) => shape.value);
  };

  // Helper function to get additional shapes beyond predefined ones
  const getAdditionalShapes = () => {
    if (!searchParams) return [];
    const predefinedShapes = getPredefinedShapes();
    return searchParams.shape
      .map((shape) => shape.trim())
      .filter((shape) => !predefinedShapes.includes(shape));
  };

  // Helper function to check if "Other" option should be shown
  const shouldShowOtherOption = () => {
    return getAdditionalShapes().length > 0;
  };

  // Helper function to get predefined cut grades
  const getPredefinedCutGrades = () => {
    return CUT_ORDER;
  };

  // Helper function to get additional cut grades beyond predefined ones
  const getAdditionalCutGrades = () => {
    if (!searchParams) return [];
    const predefinedCutGrades = getPredefinedCutGrades();
    return searchParams.cut
      .map((cut) => cut.trim())
      .filter((cut) => !predefinedCutGrades.includes(cut));
  };

  // Helper function to check if "Other" option should be shown for cut
  const shouldShowOtherCutOption = () => {
    return getAdditionalCutGrades().length > 0;
  };

  // Helper function to handle cut toggle with "Other" logic
  const handleCutToggle = (cut: string) => {
    if (cut === "OTHER") {
      const otherCutGrades = getAdditionalCutGrades();
      const hasOtherSelected = filters.cut.includes("OTHER");

      let newCut;
      if (hasOtherSelected) {
        newCut = filters.cut.filter(
          (c: string) => c !== "OTHER" && !otherCutGrades.includes(c),
        );
      } else {
        newCut = [
          ...filters.cut.filter((c: string) => !otherCutGrades.includes(c)),
          "OTHER",
          ...otherCutGrades,
        ];
      }
      setFilters({ ...filters, cut: newCut });
    } else {
      const newCut = filters.cut.includes(cut)
        ? filters.cut.filter((c: string) => c !== cut)
        : [...filters.cut, cut];
      setFilters({ ...filters, cut: newCut });
    }
  };

  // Helper function to get predefined clarity grades
  const getPredefinedClarityGrades = () => {
    return CLARITY_ORDER;
  };

  // Helper function to get additional clarity grades beyond predefined ones
  const getAdditionalClarityGrades = () => {
    if (!searchParams) return [];
    const predefinedClarityGrades = getPredefinedClarityGrades();
    return searchParams.clarity
      .map((clarity) => clarity.trim())
      .filter((clarity) => !predefinedClarityGrades.includes(clarity));
  };
  
  // Helper function to handle clarity toggle with "Other" logic
  const handleClarityToggle = (clarity: string) => {
    if (clarity === "OTHER") {
      const otherClarityGrades = getAdditionalClarityGrades();
      const hasOtherSelected = filters.clarity.includes("OTHER");

      let newClarity;
      if (hasOtherSelected) {
        newClarity = filters.clarity.filter(
          (c: string) => c !== "OTHER" && !otherClarityGrades.includes(c),
        );
      } else {
        newClarity = [
          ...filters.clarity.filter(
            (c: string) => !otherClarityGrades.includes(c),
          ),
          "OTHER",
          ...otherClarityGrades,
        ];
      }
      setFilters({ ...filters, clarity: newClarity });
    } else {
      const newClarity = filters.clarity.includes(clarity)
        ? filters.clarity.filter((c: string) => c !== clarity)
        : [...filters.clarity, clarity];
      setFilters({ ...filters, clarity: newClarity });
    }
  };

  // Helper function to handle shape toggle with "Other" logic
  const handleShapeToggle = (shape: string) => {
    if (shape === "OTHER") {
      // Toggle "Other" option - when selected, it represents all additional shapes
      const otherShapes = getAdditionalShapes();
      const hasOtherSelected = filters.shape.includes("OTHER");

      let newShape;
      if (hasOtherSelected) {
        // Remove "OTHER" and all additional shapes
        newShape = filters.shape.filter(
          (s: string) => s !== "OTHER" && !otherShapes.includes(s),
        );
      } else {
        // Add "OTHER" and all additional shapes
        newShape = [
          ...filters.shape.filter((s: string) => !otherShapes.includes(s)),
          "OTHER",
          ...otherShapes,
        ];
      }
      setFilters({ ...filters, shape: newShape });
    } else {
      // Normal shape toggle logic
      const newShape = filters.shape.includes(shape)
        ? filters.shape.filter((s: string) => s !== shape)
        : [...filters.shape, shape];
      setFilters({ ...filters, shape: newShape });
    }
  };

  // Helper function to get predefined colors
  const getPredefinedColors = () => {
    return COLOR_ORDER;
  };

  // Helper function to get additional colors beyond predefined ones
  const getAdditionalColors = () => {
    if (!searchParams) return [];
    const predefinedColors = getPredefinedColors();
    return searchParams.color
      .map((color) => color.trim())
      .filter((color) => !predefinedColors.includes(color));
  };

  // Helper function to handle color range change with "Other" logic
  const handleColorRangeChange = (values: [number, number]) => {
    if (!searchParams) return;

    const predefinedColors = getPredefinedColors();
    const additionalColors = getAdditionalColors();

    // Get the selected range from predefined colors only
    const selectedColors = predefinedColors.slice(values[0], values[1] + 1);

    // Check if "Other" should be included (if range includes "Other" from predefined)
    const includesOther = selectedColors.includes("Other");

    let finalColors: string[] = [];

    if (includesOther) {
      // When "Other" is included, include all predefined colors in range plus all additional colors
      const predefinedInRange = selectedColors.filter((c) =>
        predefinedColors.includes(c) && c !== "Other",
      );
      // Include ALL additional colors when "Other" is selected
      finalColors = [...predefinedInRange, ...additionalColors];
    } else {
      // Only include predefined colors in range
      finalColors = selectedColors.filter((c) => predefinedColors.includes(c));
    }

    setFilters({ ...filters, color: finalColors });
  };

  if (!searchParams) {
    return <div className="text-center py-8">Loading filters...</div>;
  }

  // Helper function to get ordered clarity with predefined first and others grouped
  const getOrderedClarity = () => {
    if (!searchParams) return [];

    const predefinedClarityGrades = getPredefinedClarityGrades();
    const additionalClarityGrades = getAdditionalClarityGrades();

    // Get predefined clarities that exist in searchParams
    const existingPredefined = predefinedClarityGrades.filter((clarity) =>
      searchParams.clarity.map(c => c.trim()).includes(clarity),
    );

    // Combine: predefined first, then "Other" if there are additional clarities
    const ordered = [...existingPredefined];

    if (additionalClarityGrades.length > 0) {
      ordered.push("Other");
    }

    return ordered;
  };

  const orderedClarity = getOrderedClarity();

  const renderFilterContent = () => (
    <div className={`w-full space-y-8 ${garamond.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium text-brand-900">Cut</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Render predefined shapes */}
            {DIAMOND_SHAPES.map((shape, index) => (
              <div
                key={shape.value}
                className={`flex flex-col items-center justify-center border-[2px] p-3 rounded-lg cursor-pointer transition-all duration-200 md:w-auto w-[40px] ${filters.shape.includes(shape.value)
                  ? "border-brand-900 bg-brand-50"
                  : "border-white hover:border-brand-400"
                  }`}
                onClick={() => handleShapeToggle(shape.value)}
              >
                <Image
                  src={getShapeImage(shape.value)}
                  alt={shape.label}
                  width={32}
                  height={32}
                  className="object-contain h-12 w-auto"
                />
              </div>
            ))}

            {/* Render "Other" option if there are additional shapes */}
            {shouldShowOtherOption() && (
              <div
                className={`flex flex-col items-center justify-center border-[2px] p-3 rounded-lg cursor-pointer transition-all duration-200 md:w-auto w-[40px] ${filters.shape.includes("OTHER")
                  ? "border-brand-900 bg-brand-50"
                  : "border-white hover:border-brand-400"
                  }`}
                onClick={() => handleShapeToggle("OTHER")}
              >
                <Image
                  src="/assets/diamond/other.svg"
                  alt="Other"
                  width={32}
                  height={32}
                  className="object-contain h-12 w-auto"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium text-brand-900">Price</h3>
          </div>
          <div className="px-2">
            <CustomSlider
              min={searchParams.priceRange.min}
              max={searchParams.priceRange.max}
              value={[priceInputs.min, priceInputs.max]}
              onChange={handlePriceChange}
            />
            <div className="flex gap-4 mt-4">
              <Input
                type="number"
                inputMode="numeric"
                step={1}
                min={searchParams.priceRange.min}
                max={searchParams.priceRange.max}
                value={priceInputTexts.min}
                onChange={(e) => {
                  setPriceInputTexts({
                    ...priceInputTexts,
                    min: e.target.value,
                  });
                }}
                onBlur={() => handlePriceInputBlur("min")}
                onPressEnter={() => handlePriceInputBlur("min")}
                className={`w-full ${garamond.className}`}
                size="small"
              />
              <Input
                type="number"
                inputMode="numeric"
                step={1}
                min={searchParams.priceRange.min}
                max={searchParams.priceRange.max}
                value={priceInputTexts.max}
                onChange={(e) => {
                  setPriceInputTexts({
                    ...priceInputTexts,
                    max: e.target.value,
                  });
                }}
                onBlur={() => handlePriceInputBlur("max")}
                onPressEnter={() => handlePriceInputBlur("max")}
                className={`w-full ${garamond.className}`}
                size="small"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-medium text-brand-900">Color</h3>
        </div>
        <div className="px-2">
          <CustomSlider
            min={0}
            max={COLOR_ORDER.length - 1}
            value={(() => {
              if (filters.color.length === 0) return [0, COLOR_ORDER.length - 1] as [number, number];
              
              const predefinedColors = filters.color.filter((c: string) => COLOR_ORDER.includes(c));
              const additionalColors = getAdditionalColors();
              const hasAdditionalColorsSelected = filters.color.some((c: string) => additionalColors.includes(c));
              const hasOtherSelected = filters.color.includes("Other");
              
              if (predefinedColors.length > 0) {
                // Use the range of selected predefined colors
                const firstIndex = COLOR_ORDER.indexOf(predefinedColors[0]);
                const lastIndex = (hasAdditionalColorsSelected || hasOtherSelected) 
                  ? COLOR_ORDER.indexOf("Other") // Extend to "Other" if additional colors are selected
                  : COLOR_ORDER.indexOf(predefinedColors[predefinedColors.length - 1]);
                
                return [firstIndex, lastIndex] as [number, number];
              } else if (hasAdditionalColorsSelected || hasOtherSelected) {
                // If only additional colors are selected, show only "Other"
                const otherIndex = COLOR_ORDER.indexOf("Other");
                return [otherIndex, otherIndex] as [number, number];
              } else {
                return [0, COLOR_ORDER.length - 1] as [number, number];
              }
            })()}
            onChange={handleColorRangeChange}
            marks={COLOR_ORDER.reduce(
              (acc, color, index) => {
                let displayColor = color;
                if (color.includes("Faint Pinkish Brown"))
                  displayColor = "F-PB";
                else if (color.includes("Fancy Deep Brown-Yellow"))
                  displayColor = "F-DBY";
                else if (color.includes("Fancy Light Brownish Pink"))
                  displayColor = "F-LBPk";
                else if (color.includes("Fancy Light Yellow"))
                  displayColor = "F-LY";
                else if (color.includes("Fancy Purplish Pink"))
                  displayColor = "F-PP";
                else if (color.includes("Fancy Yellow")) displayColor = "F-Y";
                else if (color.includes("Very Light Green-Yellow"))
                  displayColor = "V-LGY";
                acc[index] = displayColor;
                return acc;
              },
              {} as Record<number, string>,
            )}
          />
          {/* {shouldShowOtherColorOption() && (
            <div className="mt-2">
              <Checkbox
                checked={filters.color?.includes("OTHER")}
                onChange={() => {
                  const additionalColors = getAdditionalColors();
                  const hasOtherSelected = filters.color.includes("OTHER");
                  
                  let newColors;
                  if (hasOtherSelected) {
                    newColors = filters.color.filter((c: string) => c !== "OTHER" && !additionalColors.includes(c));
                  } else {
                    newColors = [...filters.color.filter((c: string) => !additionalColors.includes(c)), "OTHER", ...additionalColors];
                  }
                  setFilters({ ...filters, color: newColors });
                }}
                className={`text-sm ${garamond.className}`}
              >
                Other
              </Checkbox>
            </div>
          )} */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
        <div className="min-w-0 space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium text-brand-900">Carat</h3>
          </div>
          <div className="px-2">
            <CustomSlider
              min={searchParams.weightRange.min}
              max={searchParams.weightRange.max}
              step={0.01}
              value={[weightInputs.min, weightInputs.max]}
              onChange={handleWeightChange}
            />
            <div className="flex gap-4 mt-4">
              <Input
                type="number"
                inputMode="decimal"
                step={0.01}
                min={searchParams.weightRange.min}
                max={searchParams.weightRange.max}
                value={weightInputTexts.min}
                onChange={(e) => {
                  setWeightInputTexts({
                    ...weightInputTexts,
                    min: e.target.value,
                  });
                }}
                onBlur={() => handleWeightInputBlur("min")}
                onPressEnter={() => handleWeightInputBlur("min")}
                className={`w-full ${garamond.className}`}
                size="small"
              />
              <Input
                type="number"
                inputMode="decimal"
                step={0.01}
                min={searchParams.weightRange.min}
                max={searchParams.weightRange.max}
                value={weightInputTexts.max}
                onChange={(e) => {
                  setWeightInputTexts({
                    ...weightInputTexts,
                    max: e.target.value,
                  });
                }}
                onBlur={() => handleWeightInputBlur("max")}
                onPressEnter={() => handleWeightInputBlur("max")}
                className={`w-full ${garamond.className}`}
                size="small"
              />
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium text-brand-900">Cut Grade</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {getPredefinedCutGrades().map((grade) => (
              <Checkbox
                key={grade}
                checked={filters.cut?.includes(grade)}
                onChange={() => handleCutToggle(grade)}
                className={`text-sm ${garamond.className}`}
              >
                {grade === "EX"
                  ? "Excellent"
                  : grade === "VG"
                    ? "Very Good"
                    : grade === "GD"
                      ? "Good"
                      : grade === "FR"
                        ? "Fair"
                        : grade === "PD"
                          ? "Poor"
                          : grade}
              </Checkbox>
            ))}
            {shouldShowOtherCutOption() && (
              <Checkbox
                key="OTHER"
                checked={filters.cut?.includes("OTHER")}
                onChange={() => handleCutToggle("OTHER")}
                className={`text-sm ${garamond.className}`}
              >
                Other
              </Checkbox>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-medium text-brand-900">Clarity</h3>
        </div>
        <div className="px-2">
          <CustomSlider
            min={0}
            max={orderedClarity.length - 1}
            value={(() => {
              if (filters.clarity.length === 0)
                return [0, orderedClarity.length - 1] as [number, number];

              // Get the selected predefined clarities
              const selectedPredefined = filters.clarity.filter(
                (c: string) =>
                  getPredefinedClarityGrades().includes(c) && c !== "OTHER",
              );
              const additionalClarityGrades = getAdditionalClarityGrades();
              const hasAdditionalClaritiesSelected = filters.clarity.some((c: string) => additionalClarityGrades.includes(c));
              const hasOtherSelected = filters.clarity.includes("OTHER");

              // Debug logging
              console.log('Clarity Slider Debug:', {
                filtersClarity: filters.clarity,
                selectedPredefined,
                additionalClarityGrades,
                hasAdditionalClaritiesSelected,
                hasOtherSelected,
                orderedClarity
              });

              let minIndex = 0;
              let maxIndex = orderedClarity.length - 1;

              if (selectedPredefined.length > 0) {
                minIndex = orderedClarity.indexOf(selectedPredefined[0]);
                maxIndex = (hasAdditionalClaritiesSelected || hasOtherSelected)
                  ? orderedClarity.indexOf("Other") // Extend to "Other" if additional clarities are selected
                  : orderedClarity.indexOf(selectedPredefined[selectedPredefined.length - 1]);
              } else if (hasAdditionalClaritiesSelected || hasOtherSelected) {
                // If only additional clarities are selected, show only "Other"
                const otherIndex = orderedClarity.indexOf("Other");
                return [otherIndex, otherIndex] as [number, number];
              }

              return [minIndex, maxIndex].sort((a, b) => a - b) as [number, number];
            })()}
            onChange={handleClarityRangeChange}
            marks={orderedClarity.reduce(
              (acc, clarity, index) => {
                acc[index] = clarity;
                return acc;
              },
              {} as Record<number, string>,
            )}
          />
        </div>
      </div>

      <div className="flex justify-between mt-10 mb-2">
        <Button
          type="text"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`text-brand-700 hover:text-brand-900 !px-0 ${garamond.className}`}
        >
          <GoPlus className="" /> Advanced Filters
        </Button>
        <Button
          type="text"
          onClick={resetFilters}
          className={`text-brand-700 hover:text-brand-900 !px-0 ${garamond.className}`}
        >
          Reset Filters
        </Button>
      </div>

      {showAdvancedFilters && (
        <AdvancedFilters
          searchParams={searchParams}
          filters={filters}
          setFilters={setFilters}
          isVisible={showAdvancedFilters}
        />
      )}
    </div>
  );

  return (
    <div className={`w-full ${garamond.className}`}>
      {/* Mobile Filter Button */}
      <div className="md:hidden flex justify-end items-center">
        <Badge>
          <div
            className="flex border-2 md:h-[52px] h-[40px] border-black rounded-[50px] px-3 justify-center items-center cursor-pointer hover:bg-brand-50 transition-colors"
            onClick={() => setShowMobileFilters(true)}
          >
            <Image
              src="/assets/jewellery/filter-icon.svg"
              alt="Filter"
              width={24}
              height={24}
              className=""
            />
            <p className={`px-2 font-[500] text-[16px] ${garamond.className}`}>
              Filter
            </p>
            <IoIosArrowDown className="h-[20px] w-auto cursor-pointer mt-1" />
          </div>
        </Badge>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Diamond Filters"
        placement="right"
        width={350}
        onClose={() => setShowMobileFilters(false)}
        open={showMobileFilters}
        className="md:hidden"
        footer={
          <div className="flex flex-col justify-center items-center w-full space-y-3">
            <button
              onClick={resetFilters}
              className={`!w-full py-3 border rounded-full text-[14px] font-medium transition-colors border-black text-brand-900 hover:bg-brand-50 ${garamond.className}`}
            >
              Reset Filters
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className={`!w-full py-3 rounded-full text-[14px] font-medium transition-colors bg-black text-white hover:bg-brand-900 ${garamond.className}`}
            >
              Apply Filters
            </button>
          </div>
        }
      >
        {renderFilterContent()}
      </Drawer>

      {/* Desktop Filters */}
      <div className="hidden md:block space-y-8">{renderFilterContent()}</div>
    </div>
  );
};

export default DiamondFilters;
