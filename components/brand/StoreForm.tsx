"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, H1, Text, Stack } from "@/components/ui";
import { 
  createStore, 
  updateStore, 
  type StoreData 
} from "@/app/actions/stores";
import { STORE_TIERS, COUNTRIES, COUNTRY_REGION_MAP } from '@/data/brand/constants'
import { DIVISION_OPTIONS } from "@/data/mcs/divisions";

interface Store {
  id: string;
  name: string;
  city: string;
  country: string;
  region: string | null;
  tier: string;
  divisions: string[];
  team_size: number | null;
  address: string | null;
}

interface StoreFormProps {
  store?: Store | null;
  mode: "create" | "edit";
}

export function StoreForm({ store, mode }: StoreFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(store?.name || "");
  const [city, setCity] = useState(store?.city || "");
  const [country, setCountry] = useState(store?.country || "");
  const [region, setRegion] = useState<"EMEA" | "Americas" | "APAC" | "Middle_East">(
    (store?.region as "EMEA" | "Americas" | "APAC" | "Middle_East") || "EMEA"
  );
  const [address, setAddress] = useState(store?.address || "");
  const [tier, setTier] = useState(store?.tier || "");
  const [divisions, setDivisions] = useState<string[]>(store?.divisions || []);
  const [teamSize, setTeamSize] = useState(store?.team_size?.toString() || "");

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

    const storeData: StoreData = {
      name,
      city,
      country,
      region,
      address: address || undefined,
      tier: tier as "T1" | "T2" | "T3" | "T4" | "T5",
      divisions,
      teamSize: teamSize ? parseInt(teamSize) : undefined,
    };

    try {
      const result = mode === "create" 
        ? await createStore(storeData)
        : await updateStore(store!.id, storeData);

      if (!result.success) {
        setError(result.error || `Failed to ${mode} store`);
        setLoading(false);
        return;
      }

      router.push("/brand/stores");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <H1 className="text-center">
        {mode === "create" ? "Add New Store" : "Edit Store"}
      </H1>
      <Text className="mt-2 text-center text-soft-grey">
        {mode === "create" 
          ? "Set up a new store location" 
          : `Update details for ${store?.name}`}
      </Text>

      <form onSubmit={handleSubmit} className="mt-8">
        <Stack gap="lg">
          {error && (
            <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Store Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Flagship Paris"
            />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label="Address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full street address"
              helperText="Optional"
            />
          </div>

          {/* Store Tier Selection */}
          <div>
            <label className="block text-label font-medium text-charcoal mb-2">
              Store Tier <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {STORE_TIERS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTier(t.value)}
                  className={`p-3 rounded border text-left transition-all ${
                    tier === t.value
                      ? "border-matte-gold bg-matte-gold/5"
                      : "border-concrete bg-white hover:border-soft-grey"
                  }`}
                >
                  <span className={`font-medium text-sm ${tier === t.value ? "text-charcoal" : "text-soft-grey"}`}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divisions Multi-select */}
          <div>
            <label className="block text-label font-medium text-charcoal mb-2">
              Divisions <span className="text-error">*</span>
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
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!name || !city || !country || !tier || divisions.length === 0}
              className="flex-1"
            >
              {mode === "create" ? "Create Store" : "Save Changes"}
            </Button>
          </div>
        </Stack>
      </form>
    </Card>
  );
}
