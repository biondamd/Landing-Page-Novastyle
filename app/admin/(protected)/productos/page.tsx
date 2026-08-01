import {
  Field,
  inputClass,
  PageHeader,
  Panel,
  StatusBadge,
  StatusSelect,
  textareaClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/AdminFeedback";
import { ImagePickerField, type AdminImage } from "@/components/admin/ImagePickerField";
import { createClient } from "@/lib/supabase/server";

import { saveCategory, saveCollection, saveProduct, saveTag } from "../actions";

type PageProps = {
  searchParams?: Promise<{ edit?: string; new?: string }>;
};

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  price: number;
  color: string;
  description: string | null;
  sold_out: boolean;
  status: string;
  category_id: number;
  collection_id: number | null;
  tag_id: number | null;
  categories?: { name: string } | null;
  product_images?: {
    id: number;
    image_url: string;
    alt: string | null;
    display_order: number;
    is_primary: boolean;
  }[];
};

export default async function ProductsAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: products }, { data: categories }, { data: collections }, { data: tags }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*, categories(name), product_images(id,image_url,alt,display_order,is_primary)")
        .order("id", { ascending: true }),
      supabase.from("categories").select("*").order("display_order", { ascending: true }),
      supabase.from("collections").select("*").order("display_order", { ascending: true }),
      supabase.from("tags").select("*").order("display_order", { ascending: true }),
    ]);

  const rows = (products ?? []) as ProductRow[];
  const selected = params?.edit
    ? rows.find((product) => String(product.id) === params.edit)
    : undefined;
  const editing = selected ?? null;
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

  return (
    <>
      <PageHeader
        title="Productos"
        count={`${rows.length} entradas encontradas`}
        actionHref="/admin/productos?new=1"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_560px]">
        <Panel>
          <table className="w-full min-w-[860px] text-left">
            <thead className="text-xs uppercase text-[#aaaacd]">
              <tr className="border-b border-[#33334f]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => (
                <tr key={product.id} className="border-b border-[#33334f] last:border-0">
                  <td className="px-4 py-4 text-[#b9b9d4]">{product.id}</td>
                  <td className="px-4 py-4">{product.name}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{product.slug}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{product.categories?.name}</td>
                  <td className="px-4 py-4">S/ {Number(product.price).toFixed(2)}</td>
                  <td className="px-4 py-4"><StatusBadge status={product.status} /></td>
                  <td className="px-4 py-4 text-right">
                    <a href={`/admin/productos?edit=${product.id}`} className="text-[#7777ff]">
                      Editar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className="flex flex-col gap-6">
          {(params?.new || editing) && (
            <Panel>
              <h2 className="mb-6 text-2xl font-bold">
                {editing ? "Editar producto" : "Crear producto"}
              </h2>
              <form action={saveProduct} className="flex flex-col gap-5">
                <input type="hidden" name="id" value={editing?.id ?? ""} />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Nombre">
                    <input name="name" defaultValue={editing?.name ?? ""} required className={inputClass} />
                  </Field>
                  <Field label="Precio">
                    <input name="price" type="number" min="0" step="0.01" defaultValue={editing?.price ?? ""} required className={inputClass} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Color">
                    <input name="color" defaultValue={editing?.color ?? ""} required className={inputClass} />
                  </Field>
                  <Field label="Categoría">
                    <select name="category_id" defaultValue={editing?.category_id ?? ""} required className={inputClass}>
                      <option value="">Elige una categoría</option>
                      {(categories ?? []).map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Colección">
                    <select name="collection_id" defaultValue={editing?.collection_id ?? ""} className={inputClass}>
                      <option value="">Sin colección</option>
                      {(collections ?? []).map((collection) => (
                        <option key={collection.id} value={collection.id}>{collection.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Tag">
                    <select name="tag_id" defaultValue={editing?.tag_id ?? ""} className={inputClass}>
                      <option value="">Sin tag</option>
                      {(tags ?? []).map((tag) => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>
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
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label className="flex items-center gap-3 text-sm font-bold">
                    <input name="sold_out" type="checkbox" defaultChecked={editing?.sold_out ?? false} className="h-5 w-5" />
                    Agotado
                  </label>
                  <Field label="Estado">
                    <StatusSelect defaultValue={editing?.status ?? "published"} />
                  </Field>
                </div>
                <SubmitButton className="bg-[#4b4bff] px-5 py-3 text-sm font-bold" />
              </form>
            </Panel>
          )}

          <Panel>
            <h2 className="mb-5 text-xl font-bold">Crear categoría rápida</h2>
            <form action={saveCategory} className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_110px_130px]">
              <input type="hidden" name="redirect_to" value="/admin/productos?new=1&saved=1" />
              <Field label="Nombre">
                <input name="name" className={inputClass} placeholder="Abrigos" />
              </Field>
              <Field label="Orden">
                <input name="display_order" type="number" defaultValue={(categories?.length ?? 0) + 1} className={inputClass} />
              </Field>
              <Field label="Estado">
                <StatusSelect />
              </Field>
              <SubmitButton className="bg-[#4b4bff] px-5 py-3 text-sm font-bold md:col-span-3">
                Crear categoría
              </SubmitButton>
            </form>
          </Panel>

          <Panel>
            <h2 className="mb-5 text-xl font-bold">Crear colección rápida</h2>
            <form action={saveCollection} className="flex flex-col gap-4">
              <input type="hidden" name="redirect_to" value="/admin/productos?new=1&saved=1" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Nombre">
                  <input name="name" required className={inputClass} placeholder="Invierno" />
                </Field>
                <Field label="Etiqueta">
                  <input name="badge_label" required className={inputClass} placeholder="Nueva temporada" />
                </Field>
              </div>
              <Field label="Descripción">
                <textarea name="description" required className={textareaClass} />
              </Field>
              <ImagePickerField label="Imagen" required libraryImages={libraryImages} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Orden">
                  <input name="display_order" type="number" defaultValue={(collections?.length ?? 0) + 1} className={inputClass} />
                </Field>
                <Field label="Estado">
                  <StatusSelect />
                </Field>
              </div>
              <SubmitButton className="bg-[#4b4bff] px-5 py-3 text-sm font-bold">
                Crear colección
              </SubmitButton>
            </form>
          </Panel>

          <Panel>
            <h2 className="mb-5 text-xl font-bold">Crear tag rápido</h2>
            <form action={saveTag} className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_110px_130px]">
              <input type="hidden" name="redirect_to" value="/admin/productos?new=1&saved=1" />
              <Field label="Nombre">
                <input name="name" className={inputClass} placeholder="Nuevo" />
              </Field>
              <Field label="Orden">
                <input name="display_order" type="number" defaultValue={(tags?.length ?? 0) + 1} className={inputClass} />
              </Field>
              <Field label="Estado">
                <StatusSelect />
              </Field>
              <SubmitButton className="bg-[#4b4bff] px-5 py-3 text-sm font-bold md:col-span-3">
                Crear tag
              </SubmitButton>
            </form>
          </Panel>
        </div>
      </div>
    </>
  );
}
