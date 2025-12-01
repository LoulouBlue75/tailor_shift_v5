import { redirect, notFound } from "next/navigation";
import { getStore } from "@/app/actions/stores";
import { StoreForm } from "@/components/brand";

export const metadata = {
  title: "Edit Store | Tailor Shift",
  description: "Edit store details",
};

interface EditStorePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStorePage({ params }: EditStorePageProps) {
  const { id } = await params;
  const store = await getStore(id);

  if (!store) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-comfortable py-8">
      <StoreForm store={store} mode="edit" />
    </div>
  );
}
