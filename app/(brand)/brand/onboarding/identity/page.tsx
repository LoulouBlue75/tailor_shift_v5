"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, H1, Text, Stack } from "@/components/ui";
import { BrandStepProgress } from "@/components/onboarding/BrandStepProgress";
import { saveBrandIdentity } from '@/app/actions/brand-onboarding'
import { BRAND_SEGMENTS } from '@/data/brand/constants'
import { DIVISION_OPTIONS } from "@/data/mcs/divisions";

export default function BrandIdentityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [segment, setSegment] = useState<string>("");
  const [divisions, setDivisions] = useState<string[]>([]);
  const [headquartersLocation, setHeadquartersLocation] = useState("");

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
      const result = await saveBrandIdentity({
        name,
        website: website || undefined,
        segment: segment as "ultra_luxury" | "luxury" | "premium" | "accessible_luxury",
        divisions,
        headquartersLocation: headquartersLocation || undefined,
      });

      if (!result.success) {
        setError(result.error || "Failed to save brand identity");
        setLoading(false);
        return;
      }

      router.push("/brand/onboarding/contact");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div>
      <BrandStepProgress currentStep={2} />

      <Card className="p-8">
        <H1 className="text-center">Brand Identity</H1>
        <Text className="mt-2 text-center text-soft-grey">
          Tell us about your brand
        </Text>

        <form onSubmit={handleSubmit} className="mt-8">
          <Stack gap="lg">
            {error && (
              <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
                {error}
              </div>
            )}

            <Input
              label="Brand Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Louis Vuitton"
            />

            <Input
              label="Website"
              name="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.yourbrand.com"
              helperText="Optional"
            />

            {/* Segment Selection */}
            <div>
              <label className="block text-label font-medium text-charcoal mb-2">
                Market Segment <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {BRAND_SEGMENTS.map((seg) => (
                  <button
                    key={seg.value}
                    type="button"
                    onClick={() => setSegment(seg.value)}
                    className={`p-4 rounded border text-left transition-all ${
                      segment === seg.value
                        ? "border-matte-gold bg-matte-gold/5 text-charcoal"
                        : "border-concrete bg-white text-soft-grey hover:border-soft-grey"
                    }`}
                  >
                    <span className="font-medium">{seg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Divisions Multi-select */}
            <div>
              <label className="block text-label font-medium text-charcoal mb-2">
                Divisions <span className="text-error">*</span>
              </label>
              <Text variant="caption" className="mb-3 text-soft-grey">
                Select at least one division your brand operates in
              </Text>
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
              {divisions.length > 0 && (
                <Text variant="caption" className="mt-2 text-matte-gold">
                  {divisions.length} division{divisions.length > 1 ? "s" : ""} selected
                </Text>
              )}
            </div>

            <Input
              label="Headquarters Location"
              name="headquartersLocation"
              value={headquartersLocation}
              onChange={(e) => setHeadquartersLocation(e.target.value)}
              placeholder="e.g., Paris, France"
              helperText="Optional"
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!name || !segment || divisions.length === 0}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </Stack>
        </form>
      </Card>
    </div>
  );
}
