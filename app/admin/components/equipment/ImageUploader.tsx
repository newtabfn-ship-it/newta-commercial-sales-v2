"use client";

import React from "react";

type UploadedImage = {
  url: string;
  publicId: string;
};

type ImageUploaderProps = {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  coverImage: number;
  setCoverImage: React.Dispatch<React.SetStateAction<number>>;
};

export default function ImageUploader({
  images,
  setImages,
  coverImage,
  setCoverImage,
}: ImageUploaderProps) {
  async function handleFiles(files: FileList | null) {
    if (!files) return;

    const uploadedImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Image upload failed.");
        continue;
      }

      const data = await response.json();

      uploadedImages.push({
        url: data.url,
        publicId: data.publicId,
      });
    }

    setImages((previous) => [...previous, ...uploadedImages]);
  }

  function removeImage(indexToRemove: number) {
    setImages((previousImages) =>
      previousImages.filter((_, index) => index !== indexToRemove)
    );

    setCoverImage((currentCover) => {
      if (currentCover === indexToRemove) return 0;
      if (currentCover > indexToRemove) return currentCover - 1;
      return currentCover;
    });
  }

  function moveImage(index: number, direction: "left" | "right") {
    setImages((previousImages) => {
      const updated = [...previousImages];

      const newIndex =
        direction === "left" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= updated.length) {
        return previousImages;
      }

      [updated[index], updated[newIndex]] = [
        updated[newIndex],
        updated[index],
      ];

      return updated;
    });

    setCoverImage((currentCover) => {
      const swapIndex =
        direction === "left" ? index - 1 : index + 1;

      if (currentCover === index) return swapIndex;

      if (currentCover === swapIndex) return index;

      return currentCover;
    });
  }

  return (
    <section>
      <h3 className="mb-4 text-xl font-bold text-[#0B2F24]">
        Images
      </h3>

      <label
        className="
          flex
          h-56
          w-full
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-xl
          border-2
          border-dashed
          border-[#D4AF37]
          bg-[#FAFAF5]
          transition
          hover:bg-[#F4F4E8]
        "
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="text-5xl">📷</div>

        <p className="mt-4 text-lg font-semibold text-[#0B2F24]">
          Click to Upload Images
        </p>

        <p className="mt-2 text-sm text-gray-500">
  Select one or more images from your computer
</p>

</label>

{images.length > 0 && (
          <div className="mt-8">
            <h4 className="mb-4 text-lg font-semibold">
              Uploaded Images
            </h4>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={`${image.publicId}-${index}`}
                  className="overflow-hidden rounded-xl border bg-white shadow"
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="h-40 w-full object-cover"
                  />

                  <div className="space-y-2 p-3">
                    <button
                      type="button"
                      onClick={() => setCoverImage(index)}
                      className={`w-full rounded py-2 text-sm font-semibold ${coverImage === index
                          ? "bg-[#D4AF37] text-[#0B2F24]"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                      {coverImage === index
                        ? "★ Cover Image"
                        : "Make Cover"}
                    </button>

                    <div className="flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => moveImage(index, "left")}
                        className="flex-1 rounded bg-gray-200 py-2 hover:bg-gray-300"
                      >
                        ←
                      </button>

                      <button
                        type="button"
                        onClick={() => moveImage(index, "right")}
                        className="flex-1 rounded bg-gray-200 py-2 hover:bg-gray-300"
                      >
                        →
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="w-full rounded bg-red-600 py-2 text-white hover:bg-red-700"
                    >
                      Delete Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </section>
  );
}