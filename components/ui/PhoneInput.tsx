"use client";

import { useState } from "react";

const COUNTRY_CODES = [
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "+32", country: "BE", flag: "🇧🇪", name: "Belgium" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+351", country: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "+43", country: "AT", flag: "🇦🇹", name: "Austria" },
  { code: "+352", country: "LU", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+377", country: "MC", flag: "🇲🇨", name: "Monaco" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+974", country: "QA", flag: "🇶🇦", name: "Qatar" },
  { code: "+852", country: "HK", flag: "🇭🇰", name: "Hong Kong" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
];

interface PhoneInputProps {
  name: string;
  label?: string;
  helperText?: string;
  defaultValue?: string;
  required?: boolean;
}

export function PhoneInput({
  name,
  label,
  helperText,
  defaultValue,
  required,
}: PhoneInputProps) {
  // Parse default value to get country code and number
  const parseDefaultValue = (value?: string) => {
    if (!value) return { countryCode: "+33", number: "" };
    
    for (const country of COUNTRY_CODES) {
      if (value.startsWith(country.code)) {
        return {
          countryCode: country.code,
          number: value.slice(country.code.length).trim(),
        };
      }
    }
    return { countryCode: "+33", number: value };
  };

  const { countryCode: initialCode, number: initialNumber } = parseDefaultValue(defaultValue);
  
  const [countryCode, setCountryCode] = useState(initialCode);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);
  const [isOpen, setIsOpen] = useState(false);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  // Combined value for form submission
  const fullNumber = phoneNumber ? `${countryCode} ${phoneNumber}` : "";

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-stone-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative flex">
        {/* Country Code Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-3 border border-r-0 border-stone-200 rounded-l-lg bg-stone-50 hover:bg-stone-100 transition-colors min-w-[90px]"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm text-stone-600">{selectedCountry.code}</span>
            <svg
              className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-stone-200 rounded-lg shadow-lg z-50">
              {COUNTRY_CODES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    setCountryCode(country.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-stone-50 transition-colors ${
                    country.code === countryCode ? "bg-sand-50" : ""
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                  <span className="text-sm text-stone-400 ml-auto">{country.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s]/g, ""))}
          placeholder="6 12 34 56 78"
          className="flex-1 px-4 py-3 border border-stone-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-sand-500/20 focus:border-sand-500 transition-colors"
        />
        
        {/* Hidden input for form submission */}
        <input type="hidden" name={name} value={fullNumber} />
      </div>
      
      {helperText && (
        <p className="text-sm text-stone-500">{helperText}</p>
      )}
    </div>
  );
}
