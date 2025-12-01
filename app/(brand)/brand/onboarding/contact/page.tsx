"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, H1, Text, Stack } from "@/components/ui";
import { BrandStepProgress } from "@/components/onboarding/BrandStepProgress";
import { saveBrandContact } from "@/app/actions/brand-onboarding";

export default function BrandContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await saveBrandContact({
        contactName,
        contactRole,
        contactEmail,
        contactPhone: contactPhone || undefined,
      });

      if (!result.success) {
        setError(result.error || "Failed to save contact information");
        setLoading(false);
        return;
      }

      router.push("/brand/onboarding/store");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div>
      <BrandStepProgress currentStep={3} />

      <Card className="p-8">
        <H1 className="text-center">Contact Information</H1>
        <Text className="mt-2 text-center text-soft-grey">
          Who should we contact about opportunities and matches?
        </Text>

        <form onSubmit={handleSubmit} className="mt-8">
          <Stack gap="lg">
            {error && (
              <div className="rounded border border-error/20 bg-error/5 p-4 text-sm text-error">
                {error}
              </div>
            )}

            <Input
              label="Contact Name"
              name="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              placeholder="e.g., Marie Dupont"
            />

            <Input
              label="Role / Title"
              name="contactRole"
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
              required
              placeholder="e.g., HR Director, Retail Manager"
            />

            <Input
              label="Email"
              name="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              placeholder="contact@yourbrand.com"
            />

            <Input
              label="Phone Number"
              name="contactPhone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+33 1 23 45 67 89"
              helperText="Optional"
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/brand/onboarding/identity")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!contactName || !contactRole || !contactEmail}
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
