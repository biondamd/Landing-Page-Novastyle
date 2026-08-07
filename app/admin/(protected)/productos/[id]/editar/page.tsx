import { ProductForm } from "@/components/admin/ProductForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  return <ProductForm productId={Number(id)} />;
}
