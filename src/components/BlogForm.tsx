
"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  title: string;
  image: string;
  description: string;
};

type FormErrors = {
  title?: string;
  image?: string;
  description?: string;
  general?: string;
};

export default function BlogForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    image: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function validateForm() {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = "Please enter a valid image URL";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        "Description must be at least 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    field: keyof FormData,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      general: undefined,
    }));

    setSuccessMessage("");
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors({
        image: "Please select a valid image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        image: "Image size must be less than 5 MB.",
      });
      return;
    }

    try {
      setIsUploading(true);
      setErrors({});
      setSuccessMessage("");

      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Cloudinary configuration is missing."
        );
      }

      const uploadData = new window.FormData();

      uploadData.append("file", file);
      uploadData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary error:", data);

        throw new Error(
          data.error?.message || "Image upload failed."
        );
      }

      handleChange("image", data.secure_url);

      setSuccessMessage(
        "Image uploaded successfully!"
      );
    } catch (error) {
      console.error("Image upload error:", error);

      setErrors({
        image:
          error instanceof Error
            ? error.message
            : "Unable to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSuccessMessage("");
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          image: formData.image.trim(),
          description: formData.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          setErrors({
            title: data.errors.title?.[0],
            image: data.errors.image?.[0],
            description: data.errors.description?.[0],
          });
        } else {
          setErrors({
            general:
              data.message ||
              "Something went wrong while creating the post.",
          });
        }

        return;
      }

      setSuccessMessage(
        "Blog post created successfully!"
      );

      setFormData({
        title: "",
        image: "",
        description: "",
      });

      setTimeout(() => {
        router.push(`/blog/${data.post.slug}`);
      }, 800);
    } catch (error) {
      console.error("Create post error:", error);

      setErrors({
        general:
          "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.general}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(event) =>
            handleChange("title", event.target.value)
          }
          placeholder="Enter your blog title"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
        />

        {errors.title && (
          <p className="mt-2 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label
          htmlFor="image"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>

        <div className="relative">
          <input
            id="image"
            type="url"
            value={formData.image}
            onChange={(event) =>
              handleChange("image", event.target.value)
            }
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting || isUploading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-14 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
          />

          {/* Upload Icon */}
          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={isSubmitting || isUploading}
            title="Upload image"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M7.5 10.5L12 6m0 0l4.5 4.5M12 6v10"
                />
              </svg>
            )}
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Paste an image URL or click the upload icon to
          upload an image.
        </p>

        {errors.image && (
          <p className="mt-2 text-sm text-red-600">
            {errors.image}
          </p>
        )}

        {/* Image Preview */}
        {formData.image && !errors.image && (
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <img
              src={formData.image}
              alt="Image preview"
              className="h-48 w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          value={formData.description}
          onChange={(event) =>
            handleChange(
              "description",
              event.target.value
            )
          }
          placeholder="Write your blog description..."
          rows={7}
          disabled={isSubmitting}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
        />

        {errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Creating post..."
          : isUploading
            ? "Uploading image..."
            : "Create Blog Post"}
      </button>
    </form>
  );
}


