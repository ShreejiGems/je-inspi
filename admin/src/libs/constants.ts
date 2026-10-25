export const COLLECTION_TYPE = [
  { value: "RING", label: "Ring" },
  { value: "EARRING", label: "Earring" },
  { value: "NECKLACE", label: "Necklace" },
  { value: "BRACELET", label: "Bracelet" },
  { value: "DIAMONDS", label: "Diamonds" },
];

export const MODE = [
  { value: "VIEW", label: "View" },
  { value: "EDIT", label: "Edit" },
  { value: "FETCH", label: "Fetch" },
];

export const originLabels: any = {
  LAB_GROWN: "Lab Grown",
  NATURAL: "Natural",
};

export enum IMAGE_TYPE {
  HERO_DESKTOP = "HERO_DESKTOP",
  HERO_MOBILE = "HERO_MOBILE",
  JEWELLERY_BANNER_DESKTOP = "JEWELLERY_BANNER_DESKTOP",
  JEWELLERY_BANNER_MOBILE = "JEWELLERY_BANNER_MOBILE",
  DIAMOND_BANNER_DESKTOP = "DIAMOND_BANNER_DESKTOP",
  DIAMOND_BANNER_MOBILE = "DIAMOND_BANNER_MOBILE",
  JEWELLERY_VIDEO = "JEWELLERY_VIDEO",
  DIAMOND_VIDEO = "DIAMOND_VIDEO",
}

export const IMAGE_TYPE_LABELS = {
  [IMAGE_TYPE.HERO_DESKTOP]: "Desktop Video",
  [IMAGE_TYPE.HERO_MOBILE]: "Mobile Video",
  [IMAGE_TYPE.JEWELLERY_BANNER_DESKTOP]: "Jewellery Banner Desktop",
  [IMAGE_TYPE.JEWELLERY_BANNER_MOBILE]: "Jewellery Banner Mobile",
  [IMAGE_TYPE.DIAMOND_BANNER_DESKTOP]: "Diamond Banner Desktop",
  [IMAGE_TYPE.DIAMOND_BANNER_MOBILE]: "Diamond Banner Mobile",
  [IMAGE_TYPE.JEWELLERY_VIDEO]: "Jewellery Video",
  [IMAGE_TYPE.DIAMOND_VIDEO]: "Diamond Video",
};

// Jewellery Product Constants
export const COLORS = ['WHITE', 'YELLOW', 'ROSE'] as const;

export const DIAMOND_SHAPES = [
  { value: 'ROUND', label: 'Round' },
  { value: 'OVAL', label: 'Oval' },
  { value: 'PRINCESS', label: 'Princess' },
  { value: 'CUSHION', label: 'Cushion' },
  { value: 'EMERALD', label: 'Emerald' },
  { value: 'RADIANT', label: 'Radiant' },
  { value: 'ASSCHER', label: 'Asscher' },
  { value: 'MARQUISE', label: 'Marquise' },
  { value: 'HEART', label: 'Heart' },
  { value: 'PEAR', label: 'Pear' },
];

export const DIAMOND_COLORS = [
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
  { value: 'H', label: 'H' },
  { value: 'I', label: 'I' },
  { value: 'J', label: 'J' },
  { value: 'K', label: 'K' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'N', label: 'N' },
  { value: 'FANCY_LIGHT', label: 'Fancy Light' },
  { value: 'FANCY', label: 'Fancy' },
  { value: 'FANCY_INTENSE', label: 'Fancy Intense' },
  { value: 'FANCY_VIVID', label: 'Fancy Vivid' },
  { value: 'FANCY_DEEP', label: 'Fancy Deep' },
  { value: 'FANCY_DARK', label: 'Fancy Dark' },
];

export const DIAMOND_CLARITIES = [
  { value: 'IF', label: 'IF' },
  { value: 'VVS1', label: 'VVS1' },
  { value: 'VVS2', label: 'VVS2' },
  { value: 'VS1', label: 'VS1' },
  { value: 'VS2', label: 'VS2' },
  { value: 'SI1', label: 'SI1' },
  { value: 'SI2', label: 'SI2' },
  { value: 'I1', label: 'I1' },
  { value: 'I2', label: 'I2' },
];

export const DIAMOND_LABS = [
  { value: 'GIA', label: 'GIA' },
  { value: 'IGI', label: 'IGI' },
];