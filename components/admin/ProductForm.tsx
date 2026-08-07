import Link from "next/link";
import { notFound } from "next/navigation";

import { Field, inputClass, Panel, StatusSelect, textareaClass } from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/AdminFeedback";
import { ImagePickerField, type AdminImage } from "@/components/admin/ImagePickerField";
import { ProductRelationSelects } from "@/components/admin/ProductRelationSelects";
import VariantEditor, { type Variant } from "@/components/admin/VariantEditor";
import { createClient } from "@/lib/supabase/server";

import { saveProduct } from "@/app/admin/(protected)/actions";

type ProductFormProps = {
  productId?: number;
};

type ProductRow = {
  id: number;
  name: string;
  price: number;
  color: string;
  description: string | null;
  sold_out: boolean;
  status: string;
  category_id: number;
  collection_id: number | null;
  tag_id: number | null;
  product_images?: {
    id: number;
    image_url: string;
    alt: string | null;
    display_order: number;
    is_primary: boolean;
  }[];
};

export async function ProductForm({ productId }: ProductFormProps) {
  const supabase = await createClient();
  const [{ data: categories }, { data: collections }, { data: tags }, { data: products }] =
    await Promise.all([
      supabase.from("categories").select("*").order("display_order", { ascending: true }),
      supabase.from("collections").select("*").order("display_order", { ascending: true }),
      supabase.from("tags").select("*").order("display_order", { ascending: true }),
      supabase
        .from("products")
        .select("*, product_images(id,image_url,alt,display_order,is_primary)")
        .order("id", { ascending: true }),
    ]);

  const rows = (products ?? []) as ProductRow[];
  const editing = productId ? rows.find((product) => product.id === productId) ?? null : null;

  if (productId && !editing) notFound();

  const collectionImages: AdminImage[] = (collections ?? []).map((collection) => ({
    url: collection.image_url,
    name: collection.name,
  }));
  const productImages: AdminImage[] = rows.flatMap((product) =>
    (product.product_images ?? []).map((image) => ({
      id: image.id,
      url: image.image_url,
      name: image.alt ?? product.name,
      isPrimary: image.is_primary,
    })),
  );
  const productInitialImages = [...(editing?.product_images ?? [])]
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id)
    .map((image) => ({
      id: image.id,
      url: image.image_url,
      name: image.alt ?? editing?.name,
      isPrimary: image.is_primary,
    }));
  const libraryImages = [...productImages, ...collectionImages];

  let editingSizes: Variant[] = [];
  let editingColors: Variant[] = [];
  if (editing) {
    const [{ data: sizes }, { data: colors }] = await Promise.all([
      supabase
        .from("product_sizes")
        .select("label,available,display_order")
        .eq("product_id", editing.id)
        .order("display_order", { ascending: true }),
      supabase
        .from("product_colors")
        .select("label,swatch,available,display_order")
        .eq("product_id", editing.id)
        .order("display_order", { ascending: true }),
    ]);
    editingSizes = (sizes ?? []).map((size) => ({
      label: size.label,
      available: size.available,
    }));
    editingColors = (colors ?? []).map((color) => ({
      label: color.label,
      available: color.available,
      swatch: color.swatch ?? undefined,
    }));
  }

  return (
    <>
      <div className="mb-10">
        <Link href="/admin/productos" className="mb-4 inline-block text-sm text-[#7b7bff]">
          ← Volver a productos
        </Link>
        <h1 className="text-4xl font-bold">{editing ? "Editar producto" : "Crear producto"}</h1>
      </div>

      <Panel>
        <form action={saveProduct} className="flex flex-col gap-8">
          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Field label="Nombre">
              <input name="name" defaultValue={editing?.name ?? ""} required className={inputClass} />
            </Field>
            <Field label="Precio">
              <input name="price" type="number" min="0" step="0.01" defaultValue={editing?.price ?? ""} required className={inputClass} />
            </Field>
            <Field label="Color">
              <input name="color" defaultValue={editing?.color ?? ""} required className={inputClass} />
            </Field>
          </section>

          <ProductRelationSelects
            categories={(categories ?? []).map((category) => ({ id: category.id, name: category.name }))}
            collections={(collections ?? []).map((collection) => ({ id: collection.id, name: collection.name }))}
            tags={(tags ?? []).map((tag) => ({ id: tag.id, name: tag.name }))}
            defaultCategoryId={editing?.category_id}
            defaultCollectionId={editing?.collection_id}
            defaultTagId={editing?.tag_id}
            categoryOrder={(categories?.length ?? 0) + 1}
            collectionOrder={(collections?.length ?? 0) + 1}
            tagOrder={(tags?.length ?? 0) + 1}
            libraryImages={libraryImages}
          />

          <Field label="Descripción">
            <textarea name="description" defaultValue={editing?.description ?? ""} className={textareaClass} />
          </Field>

          <ImagePickerField
            label="Imágenes"
            mode="multiple"
            required
            initialImages={productInitialImages}
            libraryImages={libraryImages}
          />

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <VariantEditor
              name="sizes"
              legend="Tallas"
              addLabel="Añadir talla"
              placeholder="XS, S, M..."
              initial={editingSizes}
            />
            <VariantEditor
              name="colors"
              legend="Colores"
              withSwatch
              addLabel="Añadir color"
              placeholder="Arena, Negro..."
              initial={editingColors}
            />
          </section>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="flex items-center gap-3 text-sm font-bold">
              <input name="sold_out" type="checkbox" defaultChecked={editing?.sold_out ?? false} className="h-5 w-5" />
              Agotado
            </label>
            <Field label="Estado">
              <StatusSelect defaultValue={editing?.status ?? "published"} />
            </Field>
          </section>

          <div className="flex justify-end border-t border-[#373753] pt-6">
            <SubmitButton className="bg-[#4b4bff] px-6 py-3 text-sm font-bold" />
          </div>
        </form>
      </Panel>
    </>
  );
}
