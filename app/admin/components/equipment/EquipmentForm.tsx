"use client";

import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";

type EquipmentFormProps = {
  onSuccess: () => void;
  equipmentId: string | null;
  isEditing: boolean;
};

type UploadedImage = {
  url: string;
  publicId: string;
};

type FormData = {
  referenceNumber: string;
  category: string;
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

export default function EquipmentForm({
  onSuccess,
  equipmentId,
  isEditing,
}: EquipmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    referenceNumber: "",
    category: "",
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
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coverImage, setCoverImage] = useState(0);

  useEffect(() => {
    if (!isEditing || !equipmentId) {
      return;
    }

    async function loadEquipment() {
      try {
        const response = await fetch(`/api/equipment/${equipmentId}`);

        if (!response.ok) {
          throw new Error("Failed to load equipment.");
        }

        const equipment = await response.json();

        setFormData({
          referenceNumber: equipment.referenceNumber ?? "",
          category: equipment.category ?? "",
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
        });

        if (equipment.images?.length) {
          setImages(
            equipment.images.map((image: any) => ({
              url: image.url,
              publicId: image.publicId,
            }))
          );

          const cover = equipment.images.findIndex(
            (image: any) => image.cover
          );

          setCoverImage(cover >= 0 ? cover : 0);
        } else {
          setImages([]);
          setCoverImage(0);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadEquipment();
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
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!formData.referenceNumber.trim()) {
      alert("Please enter a Reference Number.");
      return;
    }

    if (!formData.category.trim()) {
      alert("Please select a Category.");
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

      images: images.map((image, index) => ({
        url: image.url,
        publicId: image.publicId,
        cover: index === coverImage,
      })),
    };

    try {
      const response = await fetch(
  isEditing && equipmentId
    ? `/api/equipment/${equipmentId}`
    : "/api/equipment",
  {
    method:
      isEditing && equipmentId
        ? "PUT"
        : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipmentToSave),
  }
);

      if (!response.ok) {
  const error = await response.text();

  console.error("API Error:", error);

  throw new Error(error);
}

      await response.json();

      alert(
        isEditing
          ? "Equipment updated successfully!"
          : "Equipment saved successfully!"
      );

      onSuccess();
    } catch (error) {
      console.error(error);

      alert(
        isEditing
          ? "Unable to update equipment."
          : "Unable to save equipment."
      );
    }
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

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="rounded-lg border p-3"
        >
          <option value="">Select Asset Category</option>

          <optgroup label="Commercial Vehicles">
            <option>Truck</option>
            <option>Bakkie</option>
            <option>Bus</option>
            <option>Trailer</option>
          </optgroup>

          <optgroup label="Machinery">
            <option>Earthmoving Equipment</option>
            <option>Agricultural Equipment</option>
            <option>Mining Equipment</option>
            <option>Plant Equipment</option>
          </optgroup>

          <optgroup label="Industrial">
            <option>Forklift</option>
            <option>Generator</option>
            <option>Compressor</option>
            <option>Workshop Equipment</option>
          </optgroup>

          <optgroup label="Parts & Accessories">
            <option>Attachments</option>
            <option>Spares</option>
            <option>Tyres</option>
          </optgroup>

          <optgroup label="Other">
            <option>Miscellaneous</option>
          </optgroup>
        </select>

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
            type="text"
            name="price"
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
          placeholder="Engine"
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          name="capacityBucket"
          placeholder="Capacity / Bucket"
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          name="fuelType"
          placeholder="Fuel Type"
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          name="transmission"
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
    />

  </form>
);
}