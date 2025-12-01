"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge, Button, Text } from "@/components/ui";
import { deleteStore } from "@/app/actions/stores";
import { STORE_TIERS } from "@/app/actions/brand-onboarding";

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
  status: string;
}

interface StoreCardProps {
  store: Store;
  opportunityCount?: number;
  variant?: "default" | "compact";
}

const tierLabels: Record<string, string> = {
  T1: "Flagship XXL",
  T2: "Flagship",
  T3: "Full Format",
  T4: "Boutique",
  T5: "Outlet/Travel",
};

export function StoreCard({ store, opportunityCount = 0, variant = "default" }: StoreCardProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    const result = await deleteStore(store.id);

    if (!result.success) {
      setError(result.error || "Failed to delete store");
      setDeleting(false);
      return;
    }

    setShowDeleteConfirm(false);
    router.refresh();
  };

  if (variant === "compact") {
    return (
      <Link href={`/brand/stores/${store.id}`}>
        <Card variant="interactive" className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <Text className="font-medium truncate">{store.name}</Text>
              <Text variant="caption" className="text-soft-grey">
                {store.city}, {store.country}
              </Text>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="default" size="sm">
                {store.tier}
              </Badge>
              {opportunityCount > 0 && (
                <Badge variant="success" size="sm">
                  {opportunityCount} opp{opportunityCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/brand/stores/${store.id}`}>
              <Text className="font-semibold text-lg hover:text-matte-gold transition-colors">
                {store.name}
              </Text>
            </Link>
            <Text variant="caption" className="mt-1 text-soft-grey">
              📍 {store.city}, {store.country}
              {store.region && ` • ${store.region.replace("_", " ")}`}
            </Text>
          </div>
          <Badge variant="default">
            {store.tier} - {tierLabels[store.tier] || store.tier}
          </Badge>
        </div>

        {store.divisions && store.divisions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {store.divisions.map((div: string) => (
              <Badge key={div} variant="default" size="sm">
                {div.replace("_", " ")}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-concrete">
          <div className="flex items-center gap-4">
            {store.team_size && (
              <Text variant="caption" className="text-soft-grey">
                👥 {store.team_size} team members
              </Text>
            )}
            <Text variant="caption" className="text-soft-grey">
              📋 {opportunityCount} opportunit{opportunityCount !== 1 ? "ies" : "y"}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/brand/stores/${store.id}`}>
              <Button variant="secondary" size="sm">
                View
              </Button>
            </Link>
            <Link href={`/brand/stores/${store.id}/edit`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-error hover:bg-error/5"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <Text className="font-semibold text-lg">Delete Store?</Text>
            <Text variant="body" className="mt-2 text-soft-grey">
              Are you sure you want to delete <strong>{store.name}</strong>? This action cannot be undone.
            </Text>

            {error && (
              <div className="mt-4 p-3 rounded bg-error/5 border border-error/20 text-error text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setError(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
                loading={deleting}
                className="bg-error hover:bg-error/90"
              >
                Delete Store
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
