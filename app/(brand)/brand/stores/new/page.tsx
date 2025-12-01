import { StoreForm } from "@/components/brand";

export const metadata = {
  title: "Add Store | Tailor Shift",
  description: "Add a new store location",
};

export default function NewStorePage() {
  return (
    <div className="mx-auto max-w-2xl px-comfortable py-8">
      <StoreForm mode="create" />
    </div>
  );
}
