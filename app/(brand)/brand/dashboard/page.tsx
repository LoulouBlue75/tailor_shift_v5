import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, Badge, Button, H1, H2, Text, Stack } from "@/components/ui";
import { StoreCard } from "@/components/brand";

export default async function BrandDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile and check onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect("/brand/onboarding");
  }

  // Get brand data
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (!brand) {
    redirect("/brand/onboarding");
  }

  // Get stores (limit 5 for dashboard)
  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get total stores count
  const { count: totalStoreCount } = await supabase
    .from("stores")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brand.id);

  // Get store IDs for opportunity counts
  const storeIds = stores?.map(s => s.id) || [];
  let storeOpportunityCounts: Record<string, number> = {};
  
  if (storeIds.length > 0) {
    const { data: opps } = await supabase
      .from("opportunities")
      .select("store_id")
      .in("store_id", storeIds)
      .eq("status", "active");

    if (opps) {
      opps.forEach(opp => {
        if (opp.store_id) {
          storeOpportunityCounts[opp.store_id] = (storeOpportunityCounts[opp.store_id] || 0) + 1;
        }
      });
    }
  }

  // Get active opportunities (limit 5)
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .eq("brand_id", brand.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get total active opportunities count
  const { count: totalOpportunityCount } = await supabase
    .from("opportunities")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brand.id)
    .eq("status", "active");

  // Get matches with mutual interest
  const { count: mutualMatchCount } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true })
    .eq("status", "mutual_interest");

  // Get store names for opportunities display
  let storeNames: Record<string, string> = {};
  if (storeIds.length > 0 && stores) {
    stores.forEach(store => {
      storeNames[store.id] = store.name;
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-comfortable py-8">
      <Stack gap="xl">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <H1>Welcome, {brand.name}! 👋</H1>
            <Text className="mt-2 text-soft-grey">
              Manage your stores, opportunities, and talent matches.
            </Text>
          </div>
          {brand.logo_url && (
            <img 
              src={brand.logo_url} 
              alt={`${brand.name} logo`} 
              className="h-16 w-auto object-contain"
            />
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <Text variant="caption" className="text-soft-grey uppercase tracking-wider">
              Stores
            </Text>
            <Text className="text-3xl font-bold mt-1">{totalStoreCount || 0}</Text>
          </Card>

          <Card className="p-4 text-center">
            <Text variant="caption" className="text-soft-grey uppercase tracking-wider">
              Active Opportunities
            </Text>
            <Text className="text-3xl font-bold mt-1">{totalOpportunityCount || 0}</Text>
          </Card>

          <Card className="p-4 text-center">
            <Text variant="caption" className="text-soft-grey uppercase tracking-wider">
              Mutual Matches
            </Text>
            <Text className="text-3xl font-bold mt-1 text-success">{mutualMatchCount || 0}</Text>
          </Card>

          <Card className="p-4 text-center bg-matte-gold/5 border-matte-gold/20">
            <Text variant="caption" className="text-matte-gold uppercase tracking-wider">
              Quick Action
            </Text>
            <Link href="/brand/opportunities/new" className="block mt-2">
              <Button size="sm" className="w-full">
                + New Opportunity
              </Button>
            </Link>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Opportunities Widget */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Text variant="caption" className="text-soft-grey uppercase tracking-wider">
                Active Opportunities
              </Text>
              <Link href="/brand/opportunities" className="text-sm text-matte-gold hover:underline">
                View All
              </Link>
            </div>

            {!opportunities || opportunities.length === 0 ? (
              <div className="text-center py-8">
                <Text className="text-soft-grey">No active opportunities</Text>
                <Text variant="caption" className="mt-1 text-soft-grey">
                  Post your first role to start attracting talent
                </Text>
                <Link href="/brand/opportunities/new" className="mt-4 inline-block">
                  <Button size="sm">Post Opportunity</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {opportunities.map((opp) => (
                  <Link key={opp.id} href={`/brand/opportunities/${opp.id}`}>
                    <div className="p-3 rounded border border-concrete hover:border-matte-gold transition-colors">
                      <div className="flex items-center justify-between">
                        <Text className="font-medium">{opp.title}</Text>
                        <Badge variant="default" size="sm">{opp.role_level}</Badge>
                      </div>
                      <Text variant="caption" className="mt-1 text-soft-grey">
                        {opp.store_id ? storeNames[opp.store_id] || "Store" : "Brand-level"}
                        {opp.division && ` • ${opp.division.replace("_", " ")}`}
                      </Text>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Top Matches Widget */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Text variant="caption" className="text-soft-grey uppercase tracking-wider">
                Top Talent Matches
              </Text>
              <Link href="/brand/matches" className="text-sm text-matte-gold hover:underline">
                View All
              </Link>
            </div>

            <div className="text-center py-8">
              <Text className="text-soft-grey">No matches yet</Text>
              <Text variant="caption" className="mt-1 text-soft-grey">
                Post opportunities to start receiving talent matches
              </Text>
            </div>
          </Card>
        </div>

        {/* Stores Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Text variant="caption" className="text-soft-grey uppercase tracking-wider">
              Your Stores
            </Text>
            <div className="flex gap-2">
              {(totalStoreCount || 0) > 5 && (
                <Link href="/brand/stores" className="text-sm text-matte-gold hover:underline">
                  View All ({totalStoreCount})
                </Link>
              )}
              <Link href="/brand/stores/new">
                <Button size="sm" variant="secondary">+ Add Store</Button>
              </Link>
            </div>
          </div>

          {!stores || stores.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-matte-gold/10">
                <span className="text-xl">🏪</span>
              </div>
              <Text className="mt-4 text-soft-grey">No stores yet</Text>
              <Text variant="caption" className="mt-1 text-soft-grey">
                Add your first store to start posting opportunities
              </Text>
              <Link href="/brand/stores/new" className="mt-4 inline-block">
                <Button size="sm">Add Your First Store</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store) => (
                <StoreCard 
                  key={store.id} 
                  store={store} 
                  opportunityCount={storeOpportunityCounts[store.id] || 0}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/brand/opportunities/new">
            <Card variant="interactive" className="p-6 text-center h-full">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-matte-gold/10">
                <span className="text-xl">📋</span>
              </div>
              <Text className="mt-4 font-medium">Post New Opportunity</Text>
              <Text variant="caption" className="mt-1 text-soft-grey">
                Create a job posting to attract talent
              </Text>
            </Card>
          </Link>

          <Link href="/brand/stores/new">
            <Card variant="interactive" className="p-6 text-center h-full">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-matte-gold/10">
                <span className="text-xl">🏪</span>
              </div>
              <Text className="mt-4 font-medium">Add Store</Text>
              <Text variant="caption" className="mt-1 text-soft-grey">
                Set up a new store location
              </Text>
            </Card>
          </Link>

          <Card className="p-6 text-center opacity-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-concrete">
              <span className="text-xl">🔍</span>
            </div>
            <Text className="mt-4 font-medium">Search Talents</Text>
            <Text variant="caption" className="mt-1 text-soft-grey">
              Coming soon
            </Text>
          </Card>
        </div>
      </Stack>
    </div>
  );
}
