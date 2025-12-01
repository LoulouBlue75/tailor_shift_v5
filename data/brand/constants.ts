// Brand-related constants for use in both client and server components

export const BRAND_SEGMENTS = [
  { value: 'ultra_luxury', label: 'Ultra Luxury' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'premium', label: 'Premium' },
  { value: 'accessible_luxury', label: 'Accessible Luxury' },
] as const

export const REGIONS = [
  { value: 'EMEA', label: 'EMEA (Europe, Middle East & Africa)' },
  { value: 'Americas', label: 'Americas' },
  { value: 'APAC', label: 'Asia Pacific' },
  { value: 'Middle_East', label: 'Middle East' },
] as const

export const STORE_TIERS = [
  {
    value: 'T1',
    label: 'T1 - Flagship XXL',
    description: 'Major flagship stores in prime locations',
  },
  { value: 'T2', label: 'T2 - Flagship', description: 'Standard flagship stores' },
  { value: 'T3', label: 'T3 - Full Format', description: 'Full range boutiques' },
  { value: 'T4', label: 'T4 - Boutique', description: 'Smaller boutiques' },
  {
    value: 'T5',
    label: 'T5 - Outlet/Travel Retail',
    description: 'Outlet or travel retail locations',
  },
] as const

// Country to Region mapping
export const COUNTRY_REGION_MAP: Record<string, 'EMEA' | 'Americas' | 'APAC' | 'Middle_East'> = {
  // EMEA
  France: 'EMEA',
  'United Kingdom': 'EMEA',
  Germany: 'EMEA',
  Italy: 'EMEA',
  Spain: 'EMEA',
  Switzerland: 'EMEA',
  Netherlands: 'EMEA',
  Belgium: 'EMEA',
  Austria: 'EMEA',
  Sweden: 'EMEA',
  Norway: 'EMEA',
  Denmark: 'EMEA',
  Finland: 'EMEA',
  Portugal: 'EMEA',
  Greece: 'EMEA',
  Poland: 'EMEA',
  'Czech Republic': 'EMEA',
  Ireland: 'EMEA',
  Russia: 'EMEA',
  // Americas
  'United States': 'Americas',
  Canada: 'Americas',
  Mexico: 'Americas',
  Brazil: 'Americas',
  Argentina: 'Americas',
  Chile: 'Americas',
  Colombia: 'Americas',
  // APAC
  Japan: 'APAC',
  China: 'APAC',
  'South Korea': 'APAC',
  'Hong Kong': 'APAC',
  Singapore: 'APAC',
  Australia: 'APAC',
  'New Zealand': 'APAC',
  Thailand: 'APAC',
  Malaysia: 'APAC',
  Indonesia: 'APAC',
  Vietnam: 'APAC',
  India: 'APAC',
  Taiwan: 'APAC',
  // Middle East
  'United Arab Emirates': 'Middle_East',
  'Saudi Arabia': 'Middle_East',
  Qatar: 'Middle_East',
  Kuwait: 'Middle_East',
  Bahrain: 'Middle_East',
  Oman: 'Middle_East',
}

export const COUNTRIES = Object.keys(COUNTRY_REGION_MAP)
