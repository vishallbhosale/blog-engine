
"use client";

import { FormEvent, useState } from "react";
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

  const [formData, setFormData] = useState<FormData>({
    title: "",
    image: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      setSuccessMessage("Blog post created successfully!");

      setFormData({
        title: "",
        image: "",
        description: "",
      });

      // Redirect to the newly created blog
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
      {/* General Error */}
      {errors.general && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.general}
        </div>
      )}

      {/* Success Message */}
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

        <input
          id="image"
          type="url"
          value={formData.image}
          onChange={(event) =>
            handleChange("image", event.target.value)
          }
          placeholder="https://example.com/image.jpg"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
        />

        {errors.image && (
          <p className="mt-2 text-sm text-red-600">
            {errors.image}
          </p>
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
            handleChange("description", event.target.value)
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
        disabled={isSubmitting}
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating post..." : "Create Blog Post"}
      </button>
    </form>
  );
}
