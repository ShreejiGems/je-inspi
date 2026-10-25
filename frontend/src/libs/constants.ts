export const COLLECTION_TYPE = [
  { value: "RING", label: "Ring" },
  { value: "EARRING", label: "Earring" },
  { value: "NECKLACE", label: "Necklace" },
  { value: "BRACELET", label: "Bracelet" },
  { value: "DIAMONDS", label: "Diamonds" },
];

export const DIAMOND_CUT_SHAPES = [
  { value: "ROUND", label: "Round", icon: "◊" },
  { value: "PRINCESS", label: "Princess", icon: "◊" },
  { value: "EMERALD", label: "Emerald", icon: "◊" },
  { value: "ASSCHER", label: "Asscher", icon: "◊" },
  { value: "MARQUISE", label: "Marquise", icon: "◊" },
  { value: "OVAL", label: "Oval", icon: "◊" },
  { value: "RADIANT", label: "Radiant", icon: "◊" },
  { value: "PEAR", label: "Pear", icon: "◊" },
  { value: "HEART", label: "Heart", icon: "◊" },
  { value: "CUSHION", label: "Cushion", icon: "◊" },
];

export const DIAMOND_COLOR_GRADES = [
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  { value: "F", label: "F" },
  { value: "G", label: "G" },
  { value: "H", label: "H" },
  { value: "I", label: "I" },
  { value: "J", label: "J" },
  { value: "K", label: "K" },
  { value: "L", label: "L" },
  { value: "M", label: "M" },
];

export const DIAMOND_CLARITY_GRADES = [
  { value: "FL", label: "FL" },
  { value: "IF", label: "IF" },
  { value: "VVS1", label: "VVS1" },
  { value: "VVS2", label: "VVS2" },
  { value: "VS1", label: "VS1" },
  { value: "VS2", label: "VS2" },
  { value: "SI1", label: "SI1" },
  { value: "SI2", label: "SI2" },
  { value: "I1", label: "I1" },
  { value: "I2", label: "I2" },
];

export const DIAMOND_CUT_GRADES = [
  { value: "EXCELLENT", label: "Excellent" },
  { value: "VERY_GOOD", label: "Very Good" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
];

export const JEWELLERY_TYPE = [
  { value: "RING", label: "Ring" },
  { value: "NECKLACE", label: "Necklace" },
  { value: "EARRING", label: "Earring" },
  { value: "BRACELET", label: "Bracelet" },
  { value: "GIFT", label: "Gift" },
  { value: "COLLECTION", label: "Collection" },
  { value: "BESPOKE_CREATIONS", label: "Bespoke creations" },
];

export const EARRING_TYPE = [
  {
    value: "STUDS",
    label: "Studs",
    types: [
      { value: "SOLITAIRE_STUDS", label: "Solitaire Studs" },
      { value: "HALO", label: "Halo" },
      { value: "CLUSTER", label: "Cluster" },
    ],
  },
  {
    value: "HOOPS",
    label: "Hoops",
    types: [
      { value: "CLASSIC_HOOPS", label: "Classic Hoops" },
      { value: "CHUNKY_HOOP", label: "Chunky Hoop" },
      { value: "CLUSTER_HOOPS", label: "Cluster Hoops" },
      { value: "HUGGIES", label: "Huggies" },
    ],
  },
  {
    value: "DROPS_AND_DANGLES",
    label: "Drops & Dangles",
    types: [
      { value: "LARIAT", label: "Lariat" },
      { value: "TEARDROP", label: "Teardrop" },
      { value: "CHANDELIER", label: "Chandelier" },
    ],
  },
  {
    value: "CUFF_AND_CLIMBER",
    label: "Cuff & Climber Earrings",
    types: [],
  },
  {
    value: "THREADER",
    label: "Threader Earrings",
    types: [],
  },
  {
    value: "JACKET",
    label: "Jacket Earrings",
    types: [],
  },
  {
    value: "CHAIN",
    label: "Chain Earrings",
    types: [],
  },
];

export const GIFT_TYPE = [
  { value: "BIRTHDAY_GIFT", label: "Birthday Gift" },
  { value: "ANNIVERSARY_GIFT", label: "Anniversary Gift" },
  { value: "SURPRISE_HER", label: "Surprise Her" },
  { value: "SURPRISE_HIM", label: "Surprise Him" },
  { value: "OCCASIONAL_GIFT", label: "Occasional Gift" },
  { value: "CORPORATE_GIFT", label: "Corporate Gift" },
  { value: "CUSTOMIZED_GIFT", label: "Customize Gift from Your Heart" },
];

export const COLLECTION_NEW_TYPE = [
  { value: "NEW_ARRIVAL", label: "New Arrival" },
  { value: "FLORAL", label: "Floral" },
  { value: "DIARY", label: "Diary" },
  { value: "MINIMALIST", label: "Minimalist" },
  { value: "FRESH", label: "Fresh" },
  { value: "NATURE_INSPIRED", label: "Nature Inspired" },
];

export const RING_TYPE = [
  {
    value: "ENGAGEMENT_RING",
    label: "Engagement Ring",
    types: [
      { value: "SOLITAIRE", label: "Solitaire" },
      { value: "HALO", label: "Halo" },
      { value: "TRILOGY", label: "Trilogy" },
      { value: "PAVE", label: "Pave" },
      { value: "CLUSTER", label: "Cluster" },
      { value: "MULTI_STONE", label: "Multi-Stone" },
      { value: "VINTAGE", label: "Vintage" },
    ],
  },
  {
    value: "WEDDING_RING",
    label: "Wedding Ring",
    types: [
      { value: "BANDS", label: "Bands" },
      { value: "ETERNITY", label: "Eternity" },
      { value: "CONTOUR", label: "Contour" },
      { value: "OPEN_BANDS", label: "Open Bands" },
      { value: "PAVE", label: "Pave" },
      { value: "MULTI_STONE", label: "Multi-Stone" },
    ],
  },
  {
    value: "EVERYDAY_FASHION_RING",
    label: "Everyday Fashion Ring",
    types: [
      { value: "COCKTAIL_RINGS", label: "Cocktail Rings" },
      { value: "STACKING_RINGS", label: "Stacking Rings" },
      { value: "STATEMENT_RINGS", label: "Statement Rings" },
      { value: "SIGNET_RINGS", label: "Signet Rings" },
      { value: "CLUSTER_RINGS", label: "Cluster Rings" },
      { value: "CHAIN_RING", label: "Chain Ring" },
      { value: "INSPIRED_RING", label: "Inspired Ring" },
    ],
  },
];

export const NECKLACE_TYPE = [
  {
    value: "PENDANT_NECKLACES",
    label: "Pendant Necklaces",
    types: [
      { value: "SOLITAIRE_PENDANT", label: "Solitaire Pendant" },
      { value: "HALO_PENDANT", label: "Halo Pendant" },
      { value: "CLUSTER_PENDANT", label: "Cluster Pendant" },
      { value: "HEART_PENDANT", label: "Heart Pendant" },
      { value: "CROSS_PENDANT", label: "Cross Pendant" },
    ],
  },
  {
    value: "CHAIN_NECKLACES",
    label: "Chain Necklaces",
    types: [
      { value: "CABLE_CHAIN", label: "Cable Chain" },
      { value: "ROPE_CHAIN", label: "Rope Chain" },
      { value: "BOX_CHAIN", label: "Box Chain" },
      { value: "FIGARO_CHAIN", label: "Figaro Chain" },
      { value: "CURB_CHAIN", label: "Curb Chain" },
    ],
  },
  {
    value: "STATEMENT_NECKLACES",
    label: "Statement Necklaces",
    types: [
      { value: "CHOKER", label: "Choker" },
      { value: "COLLAR", label: "Collar" },
      { value: "BIB_NECKLACE", label: "Bib Necklace" },
      { value: "MULTI_STRAND", label: "Multi-Strand" },
    ],
  },
  {
    value: "TENNIS_NECKLACES",
    label: "Tennis Necklaces",
    types: [],
  },
  {
    value: "LAYERED_NECKLACES",
    label: "Layered Necklaces",
    types: [],
  },
];

export const BRACELET_TYPE = [
  {
    value: "CHAIN_BRACELETS",
    label: "Chain Bracelets",
    types: [
      { value: "CABLE_CHAIN_BRACELET", label: "Cable Chain" },
      { value: "ROPE_CHAIN_BRACELET", label: "Rope Chain" },
      { value: "BOX_CHAIN_BRACELET", label: "Box Chain" },
      { value: "FIGARO_CHAIN_BRACELET", label: "Figaro Chain" },
    ],
  },
  {
    value: "TENNIS_BRACELETS",
    label: "Tennis Bracelets",
    types: [
      { value: "CLASSIC_TENNIS", label: "Classic Tennis" },
      { value: "GRADUATED_TENNIS", label: "Graduated Tennis" },
      { value: "COLORED_STONE_TENNIS", label: "Colored Stone Tennis" },
    ],
  },
  {
    value: "LINK_BRACELETS",
    label: "Link Bracelets",
    types: [
      { value: "CURB_LINK", label: "Curb Link" },
      { value: "MARINER_LINK", label: "Mariner Link" },
      { value: "BYZANTINE_LINK", label: "Byzantine Link" },
    ],
  },
  {
    value: "CUFF_BRACELETS",
    label: "Cuff Bracelets",
    types: [
      { value: "OPEN_CUFF", label: "Open Cuff" },
      { value: "CLOSED_CUFF", label: "Closed Cuff" },
      { value: "HINGED_CUFF", label: "Hinged Cuff" },
    ],
  },
  {
    value: "STATEMENT_BRACELETS",
    label: "Statement Bracelets",
    types: [],
  },
  {
    value: "BANGLE_BRACELETS",
    label: "Bangle Bracelets",
    types: [],
  },
  {
    value: "CORD_BRACELETS",
    label: "Cord Bracelets",
    types: [],
  },
  {
    value: "CHARM_BRACELETS",
    label: "Charm Bracelets",
    types: [],
  },
];

export const CATEGORY_TYPE: any = [
  {
    value: "OUR_LEGACY",
    label: "JE-Inspi",
    selected_text: "GENERATIONAL INTEGRITY",
    description:
      "Explore fine jewellery and diamonds selected for the JE-Inspi collection. Contact our team for product details and availability.",
    img1: "/assets/home/section-5/LEGACY 1.svg",
    img2: "/assets/home/section-5/LEGACY 2.svg",
  },
  {
    value: "OUR_CRAFTSMANSHIP",
    label: "Craftsmanship",
    selected_text: "CRAFTED EXCELLENCE",
    description:
      "Discover jewellery and diamond designs from JE-Inspi. Product materials, specifications, and availability are provided with each listing.",
    img1: "/assets/home/section-5/MANU 1.svg",
    img2: "/assets/home/section-5/MANU 2.svg",
  },
  {
    value: "YOUR_TRUSTED_JEWELLERY_PARTNER",
    label: "Inventory Spectrum",
    selected_text: "INVENTORY SPECTRUM",
    description:
      "Browse the JE-Inspi selection of jewellery and diamonds, with collection details available on product pages.",
    img1: "/assets/home/section-5/PRODUICT 1.svg",
    img2: "/assets/home/section-5/PRODUICT 2.svg",
  },
  {
    value: "CRAFTING_TRUST_WITH_QUALITY",
    label: "Holistic Transformation",
    selected_text: "HOLISTIC TRANSFORMATION",
    description:
      "Our dedication to responsible growth follows a deliberate, long-term path. We implement comprehensive social responsibility, climate change mitigation, and profound community support into our core operations. This principled stewardship ensures that every diamond and piece of jewellery is sourced and manufactured with transcendent ethical integrity. By prioritizing sustainable evolution and all-encompassing accountability, we offer our partners not just products, but a future-proof supply chain built on unprecedented trust and positive global impact.",
    img1: "/assets/home/section-5/4 SUSTANB 1.svg",
    img2: "/assets/home/section-5/SUSTANB 2.svg",
  },
];

export const BUSSINESS_TYPE = [
  { value: "RETAILER", label: "Retailer" },
  { value: "WHOLESELLER", label: "Wholeseller" },
  { value: "MANUFACTURE", label: "Manufacture" },
];

export const REG_TYPE = [
  { value: "GST", label: "GST" },
  { value: "VAT", label: "VAT" },
  { value: "BUSSINESS_REGISTRATION", label: "Business Registration" },
  { value: "BUSSINESS_LICENCE", label: "Business Licence" },
  { value: "OTHER", label: "Other" },
];

export const PRODUCT_LIST = [
  {
    value: "P1",
    image: "/assets/jewellery/product-sample.svg",
    type: "RING",
    skuId: "abc-315",
    price: "$5,200",
    isInCart: false,
  },
  {
    value: "P2",
    image: "/assets/jewellery/product-sample.svg",
    type: "NECKLACE",
    skuId: "SKU-NCK-002",
    price: "$1,250.00",
    isInCart: false,
  },
  {
    value: "P3",
    image: "/assets/jewellery/product-sample.svg",
    type: "EARRING",
    skuId: "SKU-ER-003",
    price: "$850.00",
    isInCart: false,
  },
  {
    value: "P4",
    image: "/assets/jewellery/product-sample.svg",
    type: "BRACELET",
    skuId: "SKU-BRC-004",
    price: "$1,100.00",
    isInCart: true,
  },
  {
    value: "Zig-prodct",
    image: "/assets/jewellery/product.svg",
    type: "BRACELET",
  },
  {
    value: "P5",
    image: "/assets/jewellery/product-sample.svg",
    type: "GIFT",
    skuId: "SKU-GFT-005",
    price: "$499.00",
    isInCart: true,
  },
  {
    value: "P6",
    image: "/assets/jewellery/product-sample.svg",
    type: "COLLECTION",
    skuId: "SKU-CLT-006",
    price: "$1,999.00",
    isInCart: false,
  },
  {
    value: "P7",
    image: "/assets/jewellery/product-sample.svg",
    type: "BESPOKE_CREATIONS",
    skuId: "SKU-BSK-007",
    price: "$2,500.00",
    isInCart: false,
  },
  {
    value: "P8",
    image: "/assets/jewellery/product-sample.svg",
    type: "RING", // repeat type if needed
    skuId: "SKU-RNG-008",
    price: "$299.00",
    isInCart: true,
  },
  {
    value: "P9",
    image: "/assets/jewellery/product-sample.svg",
    type: "RING",
    skuId: "SKU-RNG-009",
    price: "$250.00",
    isInCart: false,
  },
  {
    value: "P10",
    image: "/assets/jewellery/product-sample.svg",
    type: "RING",
    skuId: "SKU-RNG-010",
    price: "$250.00",
    isInCart: false,
  },
  {
    value: "P11",
    image: "/assets/jewellery/product-sample.svg",
    type: "RING",
    skuId: "SKU-RNG-011",
    price: "$250.00",
    isInCart: false,
  },
];

export const countries = [
  { name: "Afghanistan", code: "AF", dial_code: "+93" },
  { name: "Albania", code: "AL", dial_code: "+355" },
  { name: "Algeria", code: "DZ", dial_code: "+213" },
  { name: "Andorra", code: "AD", dial_code: "+376" },
  { name: "Angola", code: "AO", dial_code: "+244" },
  { name: "Argentina", code: "AR", dial_code: "+54" },
  { name: "Armenia", code: "AM", dial_code: "+374" },
  { name: "Australia", code: "AU", dial_code: "+61" },
  { name: "Austria", code: "AT", dial_code: "+43" },
  { name: "Azerbaijan", code: "AZ", dial_code: "+994" },
  { name: "Bahamas", code: "BS", dial_code: "+1" },
  { name: "Bahrain", code: "BH", dial_code: "+973" },
  { name: "Bangladesh", code: "BD", dial_code: "+880" },
  { name: "Belarus", code: "BY", dial_code: "+375" },
  { name: "Belgium", code: "BE", dial_code: "+32" },
  { name: "Belize", code: "BZ", dial_code: "+501" },
  { name: "Benin", code: "BJ", dial_code: "+229" },
  { name: "Bhutan", code: "BT", dial_code: "+975" },
  { name: "Bolivia", code: "BO", dial_code: "+591" },
  { name: "Bosnia and Herzegovina", code: "BA", dial_code: "+387" },
  { name: "Botswana", code: "BW", dial_code: "+267" },
  { name: "Brazil", code: "BR", dial_code: "+55" },
  { name: "Brunei", code: "BN", dial_code: "+673" },
  { name: "Bulgaria", code: "BG", dial_code: "+359" },
  { name: "Burkina Faso", code: "BF", dial_code: "+226" },
  { name: "Burundi", code: "BI", dial_code: "+257" },
  { name: "Cambodia", code: "KH", dial_code: "+855" },
  { name: "Cameroon", code: "CM", dial_code: "+237" },
  { name: "Canada", code: "CA", dial_code: "+1" },
  { name: "Chile", code: "CL", dial_code: "+56" },
  { name: "China", code: "CN", dial_code: "+86" },
  { name: "Colombia", code: "CO", dial_code: "+57" },
  { name: "Costa Rica", code: "CR", dial_code: "+506" },
  { name: "Croatia", code: "HR", dial_code: "+385" },
  { name: "Cuba", code: "CU", dial_code: "+53" },
  { name: "Cyprus", code: "CY", dial_code: "+357" },
  { name: "Czech Republic", code: "CZ", dial_code: "+420" },
  { name: "Denmark", code: "DK", dial_code: "+45" },
  { name: "Dominican Republic", code: "DO", dial_code: "+1" },
  { name: "Ecuador", code: "EC", dial_code: "+593" },
  { name: "Egypt", code: "EG", dial_code: "+20" },
  { name: "Estonia", code: "EE", dial_code: "+372" },
  { name: "Ethiopia", code: "ET", dial_code: "+251" },
  { name: "Fiji", code: "FJ", dial_code: "+679" },
  { name: "Finland", code: "FI", dial_code: "+358" },
  { name: "France", code: "FR", dial_code: "+33" },
  { name: "Germany", code: "DE", dial_code: "+49" },
  { name: "Ghana", code: "GH", dial_code: "+233" },
  { name: "Greece", code: "GR", dial_code: "+30" },
  { name: "Guatemala", code: "GT", dial_code: "+502" },
  { name: "Honduras", code: "HN", dial_code: "+504" },
  { name: "Hong Kong", code: "HK", dial_code: "+852" },
  { name: "Hungary", code: "HU", dial_code: "+36" },
  { name: "Iceland", code: "IS", dial_code: "+354" },
  { name: "India", code: "IN", dial_code: "+91" },
  { name: "Indonesia", code: "ID", dial_code: "+62" },
  { name: "Iran", code: "IR", dial_code: "+98" },
  { name: "Iraq", code: "IQ", dial_code: "+964" },
  { name: "Ireland", code: "IE", dial_code: "+353" },
  { name: "Israel", code: "IL", dial_code: "+972" },
  { name: "Italy", code: "IT", dial_code: "+39" },
  { name: "Jamaica", code: "JM", dial_code: "+1" },
  { name: "Japan", code: "JP", dial_code: "+81" },
  { name: "Jordan", code: "JO", dial_code: "+962" },
  { name: "Kazakhstan", code: "KZ", dial_code: "+7" },
  { name: "Kenya", code: "KE", dial_code: "+254" },
  { name: "Kuwait", code: "KW", dial_code: "+965" },
  { name: "Latvia", code: "LV", dial_code: "+371" },
  { name: "Lebanon", code: "LB", dial_code: "+961" },
  { name: "Lithuania", code: "LT", dial_code: "+370" },
  { name: "Luxembourg", code: "LU", dial_code: "+352" },
  { name: "Malaysia", code: "MY", dial_code: "+60" },
  { name: "Maldives", code: "MV", dial_code: "+960" },
  { name: "Malta", code: "MT", dial_code: "+356" },
  { name: "Mexico", code: "MX", dial_code: "+52" },
  { name: "Monaco", code: "MC", dial_code: "+377" },
  { name: "Mongolia", code: "MN", dial_code: "+976" },
  { name: "Morocco", code: "MA", dial_code: "+212" },
  { name: "Myanmar", code: "MM", dial_code: "+95" },
  { name: "Nepal", code: "NP", dial_code: "+977" },
  { name: "Netherlands", code: "NL", dial_code: "+31" },
  { name: "New Zealand", code: "NZ", dial_code: "+64" },
  { name: "Nigeria", code: "NG", dial_code: "+234" },
  { name: "North Korea", code: "KP", dial_code: "+850" },
  { name: "Norway", code: "NO", dial_code: "+47" },
  { name: "Oman", code: "OM", dial_code: "+968" },
  { name: "Pakistan", code: "PK", dial_code: "+92" },
  { name: "Panama", code: "PA", dial_code: "+507" },
  { name: "Peru", code: "PE", dial_code: "+51" },
  { name: "Philippines", code: "PH", dial_code: "+63" },
  { name: "Poland", code: "PL", dial_code: "+48" },
  { name: "Portugal", code: "PT", dial_code: "+351" },
  { name: "Qatar", code: "QA", dial_code: "+974" },
  { name: "Romania", code: "RO", dial_code: "+40" },
  { name: "Russia", code: "RU", dial_code: "+7" },
  { name: "Saudi Arabia", code: "SA", dial_code: "+966" },
  { name: "Singapore", code: "SG", dial_code: "+65" },
  { name: "South Africa", code: "ZA", dial_code: "+27" },
  { name: "South Korea", code: "KR", dial_code: "+82" },
  { name: "Spain", code: "ES", dial_code: "+34" },
  { name: "Sri Lanka", code: "LK", dial_code: "+94" },
  { name: "Sweden", code: "SE", dial_code: "+46" },
  { name: "Switzerland", code: "CH", dial_code: "+41" },
  { name: "Taiwan", code: "TW", dial_code: "+886" },
  { name: "Tanzania", code: "TZ", dial_code: "+255" },
  { name: "Thailand", code: "TH", dial_code: "+66" },
  { name: "Turkey", code: "TR", dial_code: "+90" },
  { name: "Uganda", code: "UG", dial_code: "+256" },
  { name: "Ukraine", code: "UA", dial_code: "+380" },
  { name: "United Arab Emirates", code: "AE", dial_code: "+971" },
  { name: "United Kingdom", code: "GB", dial_code: "+44" },
  { name: "United States", code: "US", dial_code: "+1" },
  { name: "Uruguay", code: "UY", dial_code: "+598" },
  { name: "Uzbekistan", code: "UZ", dial_code: "+998" },
  { name: "Vietnam", code: "VN", dial_code: "+84" },
  { name: "Yemen", code: "YE", dial_code: "+967" },
  { name: "Zambia", code: "ZM", dial_code: "+260" },
  { name: "Zimbabwe", code: "ZW", dial_code: "+263" },
];

// Sort options constant
export const SORT_OPTIONS = [
  {
    value: "DATE_NEW_TO_OLD",
    label: "Date: New to Old",
    orderBy: "createdAt|desc",
  },
  {
    value: "DATE_OLD_TO_NEW",
    label: "Date: Old to New",
    orderBy: "createdAt|asc",
  },
  {
    value: "PRICE_LOW_TO_HIGH",
    label: "Price: Low to High",
    orderBy: "basePrice|asc",
  },
  {
    value: "PRICE_HIGH_TO_LOW",
    label: "Price: High to Low",
    orderBy: "basePrice|desc",
  },
  {
    value: "ALPHABETICALLY_Z_TO_A",
    label: "Alphabetically: Z to A",
    orderBy: "name|desc",
  },
  {
    value: "ALPHABETICALLY_A_TO_Z",
    label: "Alphabetically: A to Z",
    orderBy: "name|asc",
  },
];

// Filter options constants
export const CATEGORIES = [
  { value: "ENGAGEMENT", label: "Engagement" },
  { value: "WEDDING", label: "Wedding" },
  { value: "SOLITAIRE", label: "Solitaire" },
  { value: "BAND", label: "Band" },
  { value: "HALO", label: "Halo" },
  { value: "MULTI_STONE", label: "Multi-Stone" },
];

export const MATERIALS = [
  { value: "SILVER", label: "Silver" },
  { value: "TEN_KT_GOLD", label: "10 KT" },
  { value: "FORTEEN_KT_GOLD", label: "14 KT" },
  { value: "EIGHTEEN_KT_GOLD", label: "18 KT" },
];

export const MATERIALS_OPTION = [
  { value: "silver", label: "Silver" },
  { value: "tenKtGold", label: "10 KT" },
  { value: "forteenKtGold", label: "14 KT" },
  { value: "eighteenKtGold", label: "18 KT" },
];

export const COLORS = [
  { value: "YELLOW", label: "Yellow" },
  { value: "ROSE", label: "Rose" },
  { value: "WHITE", label: "White" },
];

export const DIAMOND_SHAPES = [
  { value: "ROUND", label: "ROUND" },
  { value: "PRINCESS", label: "PRINCESS" },
  { value: "CUSHION", label: "CUSHION" },
  { value: "ASSCHER", label: "ASSCHER" },
  { value: "OVAL", label: "OVAL" },
  { value: "EMERALD", label: "EMERALD" },
  { value: "RADIANT", label: "RADIANT" },
  { value: "MARQUISE", label: "MARQUISE" },
  { value: "HEART", label: "HEART" },
  { value: "PEAR", label: "PEAR" },
];

export const SIZES = [
  { value: "3", label: "3" },
  { value: "3.5", label: "3.5" },
  { value: "4", label: "4" },
  { value: "4.5", label: "4.5" },
  { value: "5", label: "5" },
  { value: "5.5", label: "5.5" },
  { value: "6", label: "6" },
  { value: "6.5", label: "6.5" },
  { value: "7", label: "7" },
  { value: "7.5", label: "7.5" },
  { value: "8", label: "8" },
  { value: "8.5", label: "8.5" },
  { value: "9", label: "9" },
  { value: "9.5", label: "9.5" },
];

export const ABOUT_US = [
  {
    value: "Assure Legacy",
    video: "/assets/about-us/sections/section-video/lagecy.mp4",
    image: "/assets/about-us/sections/section-video/banner-image/1.png",
  },
  {
    value: "Skill Elevation",
    video:
      "/assets/about-us/sections/section-video/crafting and manufacturing.mp4",
    image: "/assets/about-us/sections/section-video/banner-image/2.png",
  },
  {
    value: "Range Defined",
    video: "/assets/about-us/sections/section-video/product portfolio.mp4",
    image: "/assets/about-us/sections/section-video/banner-image/3.png",
  },
  {
    value: "Societal Compact",
    video: "/assets/about-us/sections/section-video/day n night_.mp4",
    image: "/assets/about-us/sections/section-video/banner-image/4.png",
  },
];
