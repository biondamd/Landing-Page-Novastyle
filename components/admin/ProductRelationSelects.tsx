"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { createPortal } from "react-dom";

import { Field, inputClass, selectClass, StatusSelect, textareaClass } from "@/components/admin/AdminUi";
import { ImagePickerField, type AdminImage } from "@/components/admin/ImagePickerField";
import {
  createCategoryRelation,
  createCollectionRelation,
  createTagRelation,
} from "@/app/admin/(protected)/actions";

type Relation = {
  id: number;
  name: string;
};

type RelationType = "category" | "collection" | "tag";

type ProductRelationSelectsProps = {
  categories: Relation[];
  collections: Relation[];
  tags: Relation[];
  defaultCategoryId?: number | null;
  defaultCollectionId?: number | null;
  defaultTagId?: number | null;
  categoryOrder: number;
  collectionOrder: number;
  tagOrder: number;
  libraryImages: AdminImage[];
};

const CREATE_VALUE = "__create_relation__";

const LABELS: Record<RelationType, string> = {
  category: "categoría",
  collection: "colección",
  tag: "tag",
};

export function ProductRelationSelects({
  categories,
  collections,
  tags,
  defaultCategoryId,
  defaultCollectionId,
  defaultTagId,
  categoryOrder,
  collectionOrder,
  tagOrder,
  libraryImages,
}: ProductRelationSelectsProps) {
  const [categoryItems, setCategoryItems] = useState(categories);
  const [collectionItems, setCollectionItems] = useState(collections);
  const [tagItems, setTagItems] = useState(tags);
  const [categoryId, setCategoryId] = useState(defaultCategoryId ? String(defaultCategoryId) : "");
  const [collectionId, setCollectionId] = useState(defaultCollectionId ? String(defaultCollectionId) : "");
  const [tagId, setTagId] = useState(defaultTagId ? String(defaultTagId) : "");
  const [modalType, setModalType] = useState<RelationType | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const nextOrder = useMemo(
    () => ({
      category: categoryOrder,
      collection: collectionOrder,
      tag: tagOrder,
    }),
    [categoryOrder, collectionOrder, tagOrder],
  );

  function updateValue(type: RelationType, value: string) {
    if (value === CREATE_VALUE) {
      setError("");
      setModalType(type);
      return;
    }

    if (type === "category") setCategoryId(value);
    if (type === "collection") setCollectionId(value);
    if (type === "tag") setTagId(value);
  }

  function closeModal() {
    if (isPending) return;
    setModalType(null);
    setError("");
  }

  function handleSubmit(formData: FormData) {
    if (!modalType) return;
    const type = modalType;
    setError("");

    startTransition(async () => {
      try {
        const relation = type === "category"
          ? await createCategoryRelation(formData)
          : type === "collection"
            ? await createCollectionRelation(formData)
            : await createTagRelation(formData);
        const next = { id: Number(relation.id), name: relation.name };

        if (type === "category") {
          setCategoryItems((items) => [...items, next]);
          setCategoryId(String(next.id));
        }
        if (type === "collection") {
          setCollectionItems((items) => [...items, next]);
          setCollectionId(String(next.id));
        }
        if (type === "tag") {
          setTagItems((items) => [...items, next]);
          setTagId(String(next.id));
        }

        setModalType(null);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "No se pudo crear la relación.");
      }
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Categoría">
          <select
            name="category_id"
            value={categoryId}
            required
            className={selectClass}
            onChange={(event) => updateValue("category", event.target.value)}
          >
            <option value="">Elige una categoría</option>
            {categoryItems.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
            <option value={CREATE_VALUE}>+ Crear relación</option>
          </select>
        </Field>
        <Field label="Colección">
          <select
            name="collection_id"
            value={collectionId}
            className={selectClass}
            onChange={(event) => updateValue("collection", event.target.value)}
          >
            <option value="">Sin colección</option>
            {collectionItems.map((collection) => (
              <option key={collection.id} value={collection.id}>{collection.name}</option>
            ))}
            <option value={CREATE_VALUE}>+ Crear relación</option>
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Tag">
          <select
            name="tag_id"
            value={tagId}
            className={selectClass}
            onChange={(event) => updateValue("tag", event.target.value)}
          >
            <option value="">Sin tag</option>
            {tagItems.map((tag) => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
            <option value={CREATE_VALUE}>+ Crear relación</option>
          </select>
        </Field>
      </div>

      {modalType ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#373753] bg-[#191927] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#373753] px-5 py-4">
              <h3 className="text-base font-bold">Crear {LABELS[modalType]}</h3>
              <button
                type="button"
                onClick={closeModal}
                className="border border-[#555574] p-2 text-[#d8d8ef] hover:border-[#7777ff]"
                aria-label="Cerrar"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <form action={handleSubmit} className="flex flex-col gap-5 p-5">
              {error ? (
                <div className="border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                  {error}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Nombre">
                  <input name="name" required className={inputClass} />
                </Field>
                {modalType === "collection" ? (
                  <Field label="Etiqueta">
                    <input name="badge_label" required className={inputClass} />
                  </Field>
                ) : null}
              </div>

              {modalType === "collection" ? (
                <>
                  <Field label="Descripción">
                    <textarea name="description" required className={textareaClass} />
                  </Field>
                  <ImagePickerField label="Imagen" required libraryImages={libraryImages} />
                </>
              ) : null}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Orden">
                  <input name="display_order" type="number" defaultValue={nextOrder[modalType]} className={inputClass} />
                </Field>
                <Field label="Estado">
                  <StatusSelect />
                </Field>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#373753] pt-5">
                <button type="button" onClick={closeModal} className="border border-[#555574] px-5 py-3 text-sm font-bold hover:border-[#7777ff]">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 bg-[#4b4bff] px-5 py-3 text-sm font-bold text-white hover:bg-[#6565ff] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                  Crear {LABELS[modalType]}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
