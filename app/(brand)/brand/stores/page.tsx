import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, Button, H1, Text } from "@/components/ui";
import { StoreCard } from "@/components/brand";

export const metadata = {
  title: "Stores | Tailor Shift",
  description: "Manage your store locations",
};

export default async function StoresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get brand
  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!brand) {
    redirect("/brand/onboarding");
  }

  // Get all stores with opportunity counts
  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  // Get opportunity counts per store
  const storeIds = stores?.map(s => s.id) || [];
  let opportunityCounts: Record<string, number> = {};
  
  if (storeIds.length > 0) {
    const { data: opps } = await supabase
      .from("opportunities")
      .select("store_id")
      .in("store_id", storeIds)
      .eq("status", "active");

    if (opps) {
      opps.forEach(opp => {
        if (opp.store_id) {
          opportunityCounts[opp.store_id] = (opportunityCounts[opp.store_id] || 0) + 1;
        }
      });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-comfortable py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <H1>Stores</H1>
          <Text variant="body" className="mt-1 text-soft-grey">
            Manage your store locations
          </Text>
        </div>
        <Link href="/brand/stores/new">
          <Button>+ Add Store</Button>
        </Link>
      </div>

      {/* Stores List */}
      {!stores || stores.length === 0 ? (
        <Card className="mt-8 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-matte-gold/10">
            <span className="text-3xl">🏪</span>
          </div>
          <Text className="mt-4 font-medium">No stores yet</Text>
          <Text variant="caption" className="mt-2 text-soft-grey max-w-md mx-auto">
            Add your first store to start posting opportunities and attracting top talent.
          </Text>
          <Link href="/brand/stores/new" className="mt-6 inline-block">
            <Button>Add Your First Store</Button>
          </Link>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              opportunityCount={opportunityCounts[store.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
