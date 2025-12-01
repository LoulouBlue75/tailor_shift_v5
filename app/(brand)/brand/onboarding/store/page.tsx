"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, H1, Text, Stack } from "@/components/ui";
import { BrandStepProgress } from "@/components/onboarding/BrandStepProgress";
import { saveFirstStore } from '@/app/actions/brand-onboarding'
import { STORE_TIERS, COUNTRIES, COUNTRY_REGION_MAP } from '@/data/brand/constants'
import { DIVISION_OPTIONS } from "@/data/mcs/divisions";

export default function BrandStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState<"EMEA" | "Americas" | "APAC" | "Middle_East">("EMEA");
  const [address, setAddress] = useState("");
  const [complexityTier, setComplexityTier] = useState<string>("");
  const [divisions, setDivisions] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState<string>("");

  // Auto-update region when country changes
  useEffect(() => {
    if (country && COUNTRY_REGION_MAP[country]) {
      setRegion(COUNTRY_REGION_MAP[country]);
    }
  }, [country]);

  const toggleDivision = (divisionCode: string) => {
    setDivisions((prev) =>
      prev.includes(divisionCode)
        ? prev.filter((d) => d !== divisionCode)
        : [...prev, divisionCode]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await saveFirstStore({
        name,
        code: code || undefined,
        city,
        country,
        region,
        address: address || undefined,
        complexityTier: complexityTier as "T1" | "T2" | "T3" | "T4" | "T5",
        divisions,
        teamSize: teamSize ? parseInt(teamSize) : undefined,
      });

      if (!result.success) {
        setError(result.error || "Failed to save store");
        setLoading(false);
        return;
      }

      router.push("/brand/onboarding/opportunity-intro");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/brand/onboarding/opportunity-intro");
  };

  return (
    <div>
      <BrandStepProgress currentStep={4} />

      <Card className="p-8">
        <H1 className="text-center">Add Your First Store</H1>
        <Text className="mt-2 text-center text-soft-grey">
          Set up a store to start posting opportunities
        </Text>

        <form onSubmit={handleSubmit} className="mt-8">
          <Stack gap="lg">
            {error && (
              <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Store Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Flagship Paris"
              />
              <Input
                label="Store Code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., FR-PAR-01"
                helperText="Internal reference (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="e.g., Paris"
              />
              <div>
                <label className="block text-label font-medium text-charcoal mb-2">
                  Country <span className="text-error">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none"
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label font-medium text-charcoal mb-2">
                  Region
                </label>
                <div className="w-full rounded border border-concrete bg-off-white px-4 py-3 text-body text-soft-grey">
                  {region.replace("_", " ")}
                </div>
                <Text variant="caption" className="mt-1 text-soft-grey">
                  Auto-calculated from country
                </Text>
              </div>
              <Input
                label="Team Size"
                name="teamSize"
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g., 25"
                helperText="Optional"
              />
            </div>

            <Input
              label="Address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full street address"
              helperText="Optional"
            />

            {/* Store Tier Selection */}
            <div>
              <label className="block text-label font-medium text-charcoal mb-2">
                Store Tier <span className="text-error">*</span>
              </label>
              <div className="space-y-2">
                {STORE_TIERS.map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setComplexityTier(tier.value)}
                    className={`w-full p-4 rounded border text-left transition-all ${
                      complexityTier === tier.value
                        ? "border-matte-gold bg-matte-gold/5"
                        : "border-concrete bg-white hover:border-soft-grey"
                    }`}
                  >
                    <span className={`font-medium ${complexityTier === tier.value ? "text-charcoal" : "text-soft-grey"}`}>
                      {tier.label}
                    </span>
                    <Text variant="caption" className="mt-1 text-soft-grey">
                      {tier.description}
                    </Text>
                  </button>
                ))}
              </div>
            </div>

            {/* Divisions Multi-select */}
            <div>
              <label className="block text-label font-medium text-charcoal mb-2">
                Divisions in this Store <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DIVISION_OPTIONS.map((div) => (
                  <button
                    key={div.value}
                    type="button"
                    onClick={() => toggleDivision(div.value)}
                    className={`p-3 rounded border text-sm transition-all ${
                      divisions.includes(div.value)
                        ? "border-matte-gold bg-matte-gold/10 text-charcoal"
                        : "border-concrete bg-white text-soft-grey hover:border-soft-grey"
                    }`}
                  >
                    {div.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/brand/onboarding/contact")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!name || !city || !country || !complexityTier || divisions.length === 0}
                className="flex-1"
              >
                Add Store
              </Button>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-center text-caption text-soft-grey hover:text-charcoal transition-colors"
            >
              Skip for now - I&apos;ll add stores later
            </button>
          </Stack>
        </form>
      </Card>
    </div>
  );
}
