"use client";

/* eslint-disable @next/next/no-img-element */

import { Check, ImagePlus, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type AdminImage = {
  id?: number;
  url: string;
  name?: string;
  isPrimary?: boolean;
};

type ImageItem = AdminImage & {
  key: string;
  file?: File;
};

type ImagePickerFieldProps = {
  label: string;
  mode?: "single" | "multiple";
  name?: string;
  fileName?: string;
  initialImages?: AdminImage[];
  libraryImages?: AdminImage[];
  required?: boolean;
};

function filePreview(file: File) {
  return URL.createObjectURL(file);
}

function filenameFromUrl(url: string) {
  const clean = url.split("?")[0];
  return decodeURIComponent(clean.split("/").pop() ?? "imagen");
}

function uniqueImages(images: AdminImage[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    if (!image.url || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

function FileInput({
  name,
  file,
}: {
  name: string;
  file: File;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    ref.current.files = transfer.files;
  }, [file]);

  return <input ref={ref} type="file" name={name} className="hidden" tabIndex={-1} />;
}

export function ImagePickerField({
  label,
  mode = "single",
  name = "image_url",
  fileName = "image",
  initialImages = [],
  libraryImages = [],
  required = false,
}: ImagePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<ImageItem[]>(
    initialImages.map((image, index) => ({
      ...image,
      key: image.id ? `existing-${image.id}` : `url-${index}`,
    })),
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [draftItems, setDraftItems] = useState<ImageItem[]>(items);
  const [activeTab, setActiveTab] = useState<"library" | "selected">("library");
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  const library = useMemo(
    () => uniqueImages([...initialImages, ...libraryImages]),
    [initialImages, libraryImages],
  );
  const primaryKey = items.find((item) => item.isPrimary)?.key ?? items[0]?.key ?? "";

  useEffect(() => {
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [objectUrls]);

  function openModal() {
    setDraftItems(items);
    setActiveTab(items.length ? "selected" : "library");
    setModalOpen(true);
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const nextItems: ImageItem[] = Array.from(files).map((file) => {
      const url = filePreview(file);
      setObjectUrls((current) => [...current, url]);
      return {
        key: `new-${crypto.randomUUID()}`,
        url,
        name: file.name,
        file,
      };
    });

    setDraftItems((current) => {
      const merged = mode === "single" ? [nextItems[0]] : [...current, ...nextItems];
      if (mode === "multiple" && !merged.some((item) => item.isPrimary)) {
        return merged.map((item, index) => ({ ...item, isPrimary: index === 0 }));
      }
      return merged;
    });
    setActiveTab("selected");
  }

  function selectLibraryImage(image: AdminImage) {
    setDraftItems((current) => {
      const exists = current.some((item) => item.url === image.url);
      if (exists) return current;
      const next = {
        url: image.url,
        key: `library-${crypto.randomUUID()}`,
        name: image.name ?? filenameFromUrl(image.url),
      };
      if (mode === "single") return [next];
      return [...current, { ...next, isPrimary: current.length === 0 }];
    });
    setActiveTab("selected");
  }

  function removeDraft(key: string) {
    setDraftItems((current) => {
      const filtered = current.filter((item) => item.key !== key);
      if (mode === "multiple" && filtered.length && !filtered.some((item) => item.isPrimary)) {
        return filtered.map((item, index) => ({ ...item, isPrimary: index === 0 }));
      }
      return filtered;
    });
  }

  function moveDraft(key: string, direction: -1 | 1) {
    setDraftItems((current) => {
      const index = current.findIndex((item) => item.key === key);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function setPrimary(key: string) {
    setDraftItems((current) => current.map((item) => ({ ...item, isPrimary: item.key === key })));
  }

  function removeItem(key: string) {
    setItems((current) => {
      const filtered = current.filter((item) => item.key !== key);
      if (mode === "multiple" && filtered.length && !filtered.some((item) => item.isPrimary)) {
        return filtered.map((item, index) => ({ ...item, isPrimary: index === 0 }));
      }
      return filtered;
    });
  }

  function finishSelection() {
    setItems(draftItems);
    setModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-2 text-sm font-bold text-white">
      <span>
        {label}
        {required ? <span className="text-[#ff8d8d]">*</span> : null}
      </span>

      {mode === "single" ? (
        <>
          <input name={name} type="hidden" value={items[0]?.file ? "" : items[0]?.url ?? ""} />
          {items[0]?.file ? <FileInput name={fileName} file={items[0].file} /> : null}
          <input
            name={`${name}_presence`}
            value={items.length ? "1" : ""}
            required={required}
            onChange={() => undefined}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          {items.map((item, index) => (
            <div key={item.key}>
              <input name="product_image_key" type="hidden" value={item.key} />
              <input name={`product_image_id:${item.key}`} type="hidden" value={item.id ?? ""} />
              <input name={`product_image_url:${item.key}`} type="hidden" value={item.file ? "" : item.url} />
              <input name={`product_image_order:${item.key}`} type="hidden" value={index + 1} />
              {item.file ? <FileInput name={`product_image_file:${item.key}`} file={item.file} /> : null}
            </div>
          ))}
          <input name="product_image_primary" type="hidden" value={primaryKey} />
          <input
            name="product_images_presence"
            value={items.length ? "1" : ""}
            required={required}
            onChange={() => undefined}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        </>
      )}

      <div
        className={`min-h-36 border border-[#555574] bg-[#191927] p-4 ${
          mode === "multiple" && items.length ? "grid grid-cols-2 gap-4 md:grid-cols-3" : "flex items-center justify-center"
        }`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
      >
        {items.length ? (
          items.map((item) => (
            <div key={item.key} className="relative flex flex-col items-center gap-2">
              <img src={item.url} alt="" className="h-32 w-28 object-cover" />
              {mode === "multiple" && item.key === primaryKey ? (
                <span className="absolute left-2 top-2 bg-[#4b4bff] px-2 py-1 text-[10px] font-bold uppercase">
                  Principal
                </span>
              ) : null}
              <div className="flex items-center justify-center gap-1">
                <button type="button" onClick={openModal} className="bg-[#2c2c46] p-2 hover:bg-[#3b3b5f]" aria-label="Editar imagen">
                  <Pencil size={15} aria-hidden="true" />
                </button>
                {mode === "multiple" ? (
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="bg-[#2c2c46] p-2 hover:bg-[#3b3b5f]"
                    aria-label="Quitar imagen"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <p className="max-w-32 truncate text-xs font-normal text-[#b9b9d4]">{item.name ?? filenameFromUrl(item.url)}</p>
            </div>
          ))
        ) : (
          <button type="button" onClick={openModal} className="flex w-full flex-col items-center justify-center gap-4 py-7 text-[#b9b9d4]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6d6dff] text-white">
              <Plus size={22} aria-hidden="true" />
            </span>
            <span>Haga clic para seleccionar un activo o arrastre y suelte uno en esta área</span>
          </button>
        )}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden border border-[#373753] bg-[#191927] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#373753] px-5 py-4">
              <h3 className="text-base font-bold">Agregar Archivos</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="border border-[#555574] p-2 text-[#d8d8ef] hover:border-[#7777ff]" aria-label="Cerrar">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="border-b border-[#373753] px-8 pt-6">
              <div className="flex gap-7 text-xs font-bold uppercase">
                <button
                  type="button"
                  onClick={() => setActiveTab("library")}
                  className={`border-b-2 px-6 pb-5 ${activeTab === "library" ? "border-[#7777ff] text-[#8585ff]" : "border-transparent text-[#b9b9d4]"}`}
                >
                  Ver
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("selected")}
                  className={`border-b-2 px-6 pb-5 ${activeTab === "selected" ? "border-[#7777ff] text-[#8585ff]" : "border-transparent text-[#b9b9d4]"}`}
                >
                  Archivos seleccionados <span className="ml-2 bg-[#33334f] px-2 py-1">{draftItems.length}</span>
                </button>
              </div>
            </div>

            <div
              className="min-h-[290px] overflow-y-auto p-8"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                addFiles(event.dataTransfer.files);
              }}
            >
              <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
                <button type="button" onClick={() => inputRef.current?.click()} className="bg-[#4b4bff] px-4 py-2 text-sm text-white hover:bg-[#6565ff]">
                  Agregar más recursos
                </button>
                <input ref={inputRef} type="file" accept="image/*" multiple={mode === "multiple"} onChange={(event) => addFiles(event.target.files)} className="hidden" />
              </div>

              {activeTab === "library" ? (
                library.length ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {library.map((image) => (
                      <button
                        key={image.url}
                        type="button"
                        onClick={() => selectLibraryImage(image)}
                        className="border border-[#33334f] bg-[#202033] p-2 text-left hover:border-[#7777ff]"
                      >
                        <img src={image.url} alt="" className="mb-2 h-28 w-full object-cover" />
                        <span className="block truncate text-xs">{image.name ?? filenameFromUrl(image.url)}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-48 flex-col items-center justify-center gap-3 border border-dashed border-[#555574] text-center text-[#b9b9d4]">
                    <ImagePlus size={30} aria-hidden="true" />
                    <p>No hay imágenes disponibles. Agrega recursos para seleccionarlos.</p>
                  </div>
                )
              ) : draftItems.length ? (
                <div>
                  <p className="mb-5 text-sm">
                    {draftItems.length} {draftItems.length === 1 ? "archivo listo" : "archivos listos"} para guardar
                  </p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {draftItems.map((item, index) => (
                      <div key={item.key} className="border border-[#33334f] bg-[#202033] p-2">
                        <div className="relative">
                          <img src={item.url} alt="" className="mb-3 h-32 w-full object-cover" />
                          {mode === "multiple" && item.isPrimary ? (
                            <span className="absolute left-2 top-2 bg-[#4b4bff] px-2 py-1 text-[10px] uppercase">Principal</span>
                          ) : null}
                        </div>
                        <p className="truncate text-xs">{item.name ?? filenameFromUrl(item.url)}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {mode === "multiple" ? (
                            <>
                              <button type="button" onClick={() => setPrimary(item.key)} className="bg-[#2c2c46] p-2 hover:bg-[#3b3b5f]" aria-label="Marcar como principal">
                                <Star size={14} aria-hidden="true" />
                              </button>
                              <button type="button" onClick={() => moveDraft(item.key, -1)} disabled={index === 0} className="bg-[#2c2c46] px-2 py-1 text-xs disabled:opacity-40">
                                ↑
                              </button>
                              <button type="button" onClick={() => moveDraft(item.key, 1)} disabled={index === draftItems.length - 1} className="bg-[#2c2c46] px-2 py-1 text-xs disabled:opacity-40">
                                ↓
                              </button>
                            </>
                          ) : null}
                          {mode === "multiple" ? (
                            <button type="button" onClick={() => removeDraft(item.key)} className="bg-[#2c2c46] p-2 hover:bg-[#3b3b5f]" aria-label="Quitar">
                              <Trash2 size={14} aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-48 w-full flex-col items-center justify-center gap-3 border border-dashed border-[#555574] text-center text-[#b9b9d4]">
                  <ImagePlus size={30} aria-hidden="true" />
                  Agrega imágenes o elige una de la biblioteca.
                </button>
              )}
            </div>

            <div className="flex justify-between border-t border-[#373753] px-5 py-4">
              <button type="button" onClick={() => setModalOpen(false)} className="border border-[#555574] px-5 py-3 text-sm font-bold hover:border-[#7777ff]">
                Cancelar
              </button>
              <button type="button" onClick={finishSelection} className="inline-flex items-center gap-2 bg-[#4b4bff] px-5 py-3 text-sm font-bold hover:bg-[#6565ff]">
                <Check size={16} aria-hidden="true" />
                Terminar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
