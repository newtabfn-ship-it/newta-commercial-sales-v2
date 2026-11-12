"use client";

import { useEffect, useRef, useState } from "react";
import ImageUploader from "./ImageUploader";
import { equipmentCategories } from "@/app/data/categories";
import { isTrailer, trailerTypes, validateEquipmentClassification } from "@/lib/equipmentPublishing";

type EquipmentFormProps = {
  onSuccess: () => void;
  equipmentId: string | null;
  isEditing: boolean;
  onBusyChange: (busy: boolean) => void;
};

type UploadedImage = {
  url: string;
  publicId: string;
};

type FormData = {
  referenceNumber: string;
  category: string;
  subcategory: string;
  trailerType: string;
  title: string;
  manufacturer: string;
  model: string;
  year: string;
  serialNumber: string;
  price: string;

  status: string;

  kmHours: string;
  tyresTracks: string;
  province: string;
  condition: string;

  description: string;

  specifications: {
    engine: string;
    capacityBucket: string;
    fuelType: string;
    transmission: string;
  };

  featured: boolean;
  showOnHomePage: boolean;
};

const EMPTY_FORM: FormData = {
  referenceNumber: "",
  category: "",
  subcategory: "",
  trailerType: "",
  title: "",
  manufacturer: "",
  model: "",
  year: "",
  serialNumber: "",
  price: "",

  status: "Available",

  kmHours: "",
  tyresTracks: "",
  province: "",
  condition: "Good",

  description: "",

  specifications: {
    engine: "",
    capacityBucket: "",
    fuelType: "",
    transmission: "",
  },

  featured: false,
  showOnHomePage: false,
};

export default function EquipmentForm({
  onSuccess,
  equipmentId,
  isEditing,
  onBusyChange,
}: EquipmentFormProps) {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
 

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coverImage, setCoverImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const uploadingRef = useRef(false);
  const [originalClassification, setOriginalClassification] = useState<
    (Pick<FormData, "category" | "subcategory" | "trailerType"> & { id: string }) | null
  >(null);
  const selectedCategory = equipmentCategories.find(
  (category) => category.name === formData.category
);
  const preservingClassification =
    isEditing &&
    originalClassification?.id === equipmentId &&
    originalClassification?.category === formData.category &&
    originalClassification?.subcategory === formData.subcategory;
  const subcategoryOptions = selectedCategory?.subcategories ?? [];
  const hasLegacySubcategory =
    preservingClassification &&
    formData.subcategory !== "" &&
    !subcategoryOptions.some(({ name }) => name === formData.subcategory);

async function loadEquipment() {
  if (!equipmentId) {
    setLoading(false);
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(`/api/equipment/${equipmentId}`);

    if (!response.ok) {
      throw new Error("Failed to load equipment.");
    }

    const equipment = await response.json();

    const loadedImages = equipment.images ?? [];

    const newFormData: FormData = {
      referenceNumber: equipment.referenceNumber ?? "",
      category: equipment.category ?? "",
      subcategory: equipment.subcategory ?? "",
      trailerType: equipment.trailerType ?? "",
      title: equipment.title ?? "",
      manufacturer: equipment.manufacturer ?? "",
      model: equipment.model ?? "",
      year: equipment.year ?? "",
      serialNumber: equipment.serialNumber ?? "",
      price: equipment.price ?? "",
      status: equipment.status ?? "Available",
      kmHours: equipment.kmHours ?? "",
      tyresTracks: equipment.tyresTracks ?? "",
      province: equipment.province ?? "",
      condition: equipment.condition ?? "Good",
      description: equipment.description ?? "",

      specifications: {
        engine: equipment.specifications?.engine ?? "",
        capacityBucket:
          equipment.specifications?.capacityBucket ?? "",
        fuelType:
          equipment.specifications?.fuelType ?? "",
        transmission:
          equipment.specifications?.transmission ?? "",
      },

      featured: equipment.featured ?? false,
      showOnHomePage:
        equipment.showOnHomePage ?? false,
    };

    setFormData(newFormData);
    setOriginalClassification({
      id: equipmentId,
      category: newFormData.category,
      subcategory: newFormData.subcategory,
      trailerType: newFormData.trailerType,
    });
    setImages(loadedImages);

    const coverIndex = loadedImages.findIndex(
      (image: any) => image.cover
    );

    setCoverImage(coverIndex >= 0 ? coverIndex : 0);

  } catch (error) {
    console.error(error);
    alert("Failed to load equipment.");
  } finally {
    setLoading(false);
  }
}

 useEffect(() => {
  if (isEditing && equipmentId) {
    loadEquipment();
  } else {
    setFormData(EMPTY_FORM);
    setOriginalClassification(null);
    setImages([]);
    setCoverImage(0);
  }
}, [equipmentId, isEditing]);


    function handleChange(
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLSelectElement |
    HTMLTextAreaElement
  >
) {
  const { name, value, type } = e.target;

  setFormData((previous) => ({
    ...previous,
    [name]:
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    ...(name === "subcategory" ? { trailerType: "" } : {}),
  }));
}

   function handleSpecificationChange(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const { name, value } = e.target;

  setFormData((previous) => ({
    ...previous,
    specifications: {
      ...previous.specifications,
      [name]: value,
    },
  }));
}

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  if (uploadingRef.current || savingRef.current) return;

  if (!formData.referenceNumber.trim()) {
    alert("Please enter a Reference Number.");
    return;
  }

  const classificationError = validateEquipmentClassification(
    formData,
    isEditing && originalClassification?.id === equipmentId ? originalClassification : undefined
  );
  if (classificationError) {
    alert(classificationError);
    return;
  }

  if (!formData.title.trim()) {
    alert("Please enter a Title.");
    return;
  }

  if (!formData.price.trim()) {
    alert("Please enter a Price.");
    return;
  }
  
  const equipmentToSave = {
  ...formData,
  category: formData.category,
  subcategory: formData.subcategory,
  images: images.map((image, index) => ({
      ...image,
      cover: index === coverImage,
    })),
  };

  const url =
    isEditing && equipmentId
      ? `/api/equipment/${equipmentId}`
      : "/api/equipment";

  const method =
    isEditing && equipmentId ? "PUT" : "POST";

  savingRef.current = true;
  setSaving(true);
  onBusyChange(true);
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipmentToSave),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ?? "Unable to save equipment."
      );
    }

    const message = isEditing ? "Equipment updated successfully." : "Equipment created successfully.";
    const publication = result.publication;
    const publicUrl = publication?.publicUrl
      ? new URL(publication.publicUrl, window.location.origin).href
      : null;
    const expectedPages = publication?.expectedPages?.join("\n");
    alert([message, publicUrl && `Public listing: ${publicUrl}`,
      expectedPages && `Expected catalogue pages:\n${expectedPages}`].filter(Boolean).join("\n\n"));

    onSuccess();
  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to save equipment."
    );
  } finally {
    savingRef.current = false;
    setSaving(false);
    onBusyChange(false);
  }
}

if (loading) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-lg font-semibold text-gray-500">
        Loading equipment...
      </p>
    </div>
  );
}

 return (
  <form
    id="equipment-form"
    onSubmit={handleSubmit}
    className="space-y-8"
  >
   {/* Basic Information */}

<section>
  <h3 className="mb-4 text-xl font-bold text-[#0B2F24]">
    Basic Information
  </h3>

  <div className="grid gap-4">

    <input
      type="text"
      name="title"
      value={formData.title}
      onChange={handleChange}
      required
      placeholder="Title"
      className="rounded-lg border p-3"
    />

    <input
      type="text"
      name="referenceNumber"
      value={formData.referenceNumber}
      onChange={handleChange}
      required
      placeholder="Reference Number"
      className="rounded-lg border p-3"
    />

  {/* Category & Subcategory */}

<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  <select
    name="category"
    value={formData.category}
    onChange={(e) => {
      setFormData((previous) => ({
        ...previous,
        category: e.target.value,
        subcategory: "",
        trailerType: "",
      }));
    }}
    required
    className="rounded-lg border p-3"
  >
    <option value="">Select Main Category</option>

    {preservingClassification && !selectedCategory && formData.category && (
      <option value={formData.category}>{formData.category} (existing)</option>
    )}

    {equipmentCategories.map((category) => (
      <option key={category.slug} value={category.name}>
        {category.name}
      </option>
    ))}
  </select>

  <select
    name="subcategory"
    value={formData.subcategory}
    onChange={handleChange}
    required={!preservingClassification && subcategoryOptions.length > 0}
    disabled={subcategoryOptions.length === 0 && !hasLegacySubcategory}
    className="rounded-lg border p-3 disabled:bg-gray-100 disabled:text-gray-400"
  >
    <option value="">
      {subcategoryOptions.length > 0 ? "Select Subcategory" : "No subcategory"}
    </option>

    {hasLegacySubcategory && (
      <option value={formData.subcategory}>{formData.subcategory} (existing)</option>
    )}

    {subcategoryOptions.map((subcategory) => (
      <option key={subcategory.slug} value={subcategory.name}>
        {subcategory.name}
      </option>
    ))}
  </select>
  {isTrailer(formData) && (
    <label className="block text-sm font-semibold">
      Trailer type
      <select
        name="trailerType"
        value={formData.trailerType}
        onChange={handleChange}
        required={!preservingClassification}
        className="mt-1 w-full rounded-lg border p-3"
      >
        <option value="">Select trailer type</option>
        {preservingClassification && formData.trailerType && !Object.hasOwn(trailerTypes, formData.trailerType) && (
          <option value={formData.trailerType}>{formData.trailerType} (existing)</option>
        )}
        {Object.entries(trailerTypes).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </label>
  )}
</div>

    <input
      type="text"
      name="manufacturer"
      value={formData.manufacturer}
      onChange={handleChange}
      placeholder="Manufacturer"
      className="rounded-lg border p-3"
    />

    <input
      type="text"
      name="model"
      value={formData.model}
      onChange={handleChange}
      placeholder="Model"
      className="rounded-lg border p-3"
    />

    <div className="grid grid-cols-2 gap-4">

      <input
        type="text"
        name="year"
        value={formData.year}
        onChange={handleChange}
        placeholder="Year"
        className="rounded-lg border p-3"
      />

      <input
        type="text"
        name="serialNumber"
        value={formData.serialNumber}
        onChange={handleChange}
        placeholder="Serial / VIN"
        className="rounded-lg border p-3"
      />

    </div>

    <div className="grid grid-cols-2 gap-4">

      <input
        type="number"
        name="price"
        min="0"
        step="1"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="rounded-lg border p-3"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="rounded-lg border p-3"
      >
        <option>Available</option>
        <option>Sold</option>
      </select>

    </div>

  </div>
</section>

    {/* Machine Information */}

    <section>

      <h3 className="mb-4 text-xl font-bold text-[#0B2F24]">
        Machine Information
      </h3>

      <div className="grid gap-4">

        <input
          type="text"
          name="kmHours"
          value={formData.kmHours}
          onChange={handleChange}
          placeholder="KM / Hours"
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          name="tyresTracks"
          value={formData.tyresTracks}
          onChange={handleChange}
          placeholder="Tyres / Tracks"
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          name="province"
          value={formData.province}
          onChange={handleChange}
          placeholder="Province"
          className="rounded-lg border p-3"
        />

        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="rounded-lg border p-3"
        >
          <option>Excellent</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Needs Attention</option>
        </select>

      </div>

    </section>

       {/* Description */}

    <section>

      <h3 className="mb-4 text-xl font-bold text-[#0B2F24]">
        Description
      </h3>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={8}
        placeholder="Equipment description..."
        className="w-full rounded-lg border p-3"
      />

    </section>

    {/* Specifications */}

    <section>

      <h3 className="mb-4 text-xl font-bold text-[#0B2F24]">
        Specifications
      </h3>

      <div className="grid gap-4">

        <input
  type="text"
  name="engine"
  value={formData.specifications.engine}
  onChange={handleSpecificationChange}
  placeholder="Engine"
  className="rounded-lg border p-3"
/>

        <input
          type="text"
          name="capacityBucket"
          value={formData.specifications.capacityBucket}
          onChange={handleSpecificationChange}
          placeholder="Capacity / Bucket"
          className="rounded-lg border p-3"
          />

        <input
          type="text"
          name="fuelType"
          value={formData.specifications.fuelType}
          onChange={handleSpecificationChange}
          placeholder="Fuel Type"
          className="rounded-lg border p-3"
          />

        <input
          type="text"
          name="transmission"
          value={formData.specifications.transmission}
          onChange={handleSpecificationChange}
          placeholder="Transmission"
          className="rounded-lg border p-3"
          />

      </div>

    </section>

    {/* Listing Options */}

    <section>

      <h3 className="mb-4 text-xl font-bold text-[#0B2F24]">
        Listing Options
      </h3>

      <div className="space-y-4">

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />

          Featured Listing

        </label>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="showOnHomePage"
            checked={formData.showOnHomePage}
            onChange={handleChange}
          />

          Show on Home Page

        </label>

      </div>

    </section>

    <ImageUploader
      images={images}
      setImages={setImages}
      coverImage={coverImage}
      setCoverImage={setCoverImage}
      disabled={saving}
      onUploadChange={(uploading) => {
        uploadingRef.current = uploading;
        onBusyChange(uploading || savingRef.current);
      }}
    />

  </form>
);
}
