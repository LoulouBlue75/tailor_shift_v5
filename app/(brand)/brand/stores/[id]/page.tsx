import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoreWithOpportunities } from "@/app/actions/stores";
import { Card, Badge, Button, H1, H2, Text } from "@/components/ui";

export const metadata = {
  title: "Store Details | Tailor Shift",
  description: "View store details and opportunities",
};

const tierLabels: Record<string, string> = {
  T1: "Flagship XXL",
  T2: "Flagship",
  T3: "Full Format",
  T4: "Boutique",
  T5: "Outlet/Travel",
};

interface StoreDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const { id } = await params;
  const data = await getStoreWithOpportunities(id);

  if (!data) {
    notFound();
  }

  const { store, opportunities } = data;
  const activeOpps = opportunities.filter(o => o.status === "active");

  return (
    <div className="mx-auto max-w-4xl px-comfortable py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link href="/brand/stores" className="text-caption text-soft-grey hover:text-charcoal mb-2 inline-block">
            ← Back to Stores
          </Link>
          <H1>{store.name}</H1>
          <Text variant="body" className="mt-1 text-soft-grey">
            📍 {store.city}, {store.country}
            {store.region && ` • ${store.region.replace("_", " ")}`}
          </Text>
        </div>
        <div className="flex gap-2">
          <Link href={`/brand/stores/${store.id}/edit`}>
            <Button variant="secondary">Edit Store</Button>
          </Link>
          <Link href={`/brand/opportunities/new?store=${store.id}`}>
            <Button>+ Post Opportunity</Button>
          </Link>
        </div>
      </div>

      {/* Store Details Card */}
      <Card className="mt-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text variant="label" className="text-soft-grey">Store Tier</Text>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="default">
                {store.tier} - {tierLabels[store.tier] || store.tier}
              </Badge>
            </div>
          </div>

          {store.team_size && (
            <div>
              <Text variant="label" className="text-soft-grey">Team Size</Text>
              <Text className="mt-1">{store.team_size} members</Text>
            </div>
          )}

          {store.address && (
            <div className="md:col-span-2">
              <Text variant="label" className="text-soft-grey">Address</Text>
              <Text className="mt-1">{store.address}</Text>
            </div>
          )}

          <div className="md:col-span-2">
            <Text variant="label" className="text-soft-grey">Divisions</Text>
            <div className="mt-2 flex flex-wrap gap-2">
              {store.divisions?.map((div: string) => (
                <Badge key={div} variant="default" size="sm">
                  {div.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Opportunities Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <H2>Opportunities at this Store</H2>
          <Link href={`/brand/opportunities/new?store=${store.id}`}>
            <Button size="sm">+ New Opportunity</Button>
          </Link>
        </div>

        {opportunities.length === 0 ? (
          <Card className="p-8 text-center">
            <Text variant="body" className="text-soft-grey">
              No opportunities posted for this store yet.
            </Text>
            <Link href={`/brand/opportunities/new?store=${store.id}`} className="mt-4 inline-block">
              <Button>Post Your First Opportunity</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <Card key={opp.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Text className="font-medium">{opp.title}</Text>
                      <Badge 
                        variant={opp.status === "active" ? "success" : "default"} 
                        size="sm"
                      >
                        {opp.status}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-soft-grey">
                      <Text variant="caption">{opp.role_level}</Text>
                      {opp.division && (
                        <Text variant="caption">{opp.division.replace("_", " ")}</Text>
                      )}
                    </div>
                  </div>
                  <Link href={`/brand/opportunities/${opp.id}`}>
                    <Button variant="secondary" size="sm">View</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <Card className="mt-8 p-6 bg-off-white border-0">
        <H2 className="mb-4">Quick Stats</H2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Text className="text-3xl font-bold">{opportunities.length}</Text>
            <Text variant="caption" className="text-soft-grey">Total Opportunities</Text>
          </div>
          <div>
            <Text className="text-3xl font-bold text-success">{activeOpps.length}</Text>
            <Text variant="caption" className="text-soft-grey">Active</Text>
          </div>
          <div>
            <Text className="text-3xl font-bold">{store.team_size || "—"}</Text>
            <Text variant="caption" className="text-soft-grey">Team Members</Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
