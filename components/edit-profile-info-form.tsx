"use client";

import { useState, useEffect } from "react";
import { US_STATES } from "@/lib/address-validation";

interface EditProfileInfoFormProps {
  userId: string;
  onSuccess?: () => void;
}

export default function EditProfileInfoForm({
  userId,
  onSuccess,
}: EditProfileInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const response = await fetch("/api/users/profile-info");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          addressLine1: data.addressLine1 || "",
          addressLine2: data.addressLine2 || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile info:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/users/profile-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Handle field-specific errors
          const errors: Record<string, string> = {};
          data.errors.forEach(
            (err: { field: string; message: string }) => {
              errors[err.field] = err.message;
            }
          );
          setFieldErrors(errors);
        } else {
          setError(data.error || "Failed to update profile");
        }
        return;
      }

      setIsEditing(false);
      if (onSuccess) {
        onSuccess();
      }
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setFieldErrors({});
    fetchProfileInfo(); // Reset form data
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (!isEditing) {
    return (
      <>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-600">Email address</dt>
            <dd className="text-gray-900">{formData.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">Display name</dt>
            <dd className="text-gray-900">{formData.name || "Not set"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">Street address</dt>
            <dd className="text-gray-900">
              {formData.addressLine1 || "Not set"}
              {formData.addressLine2 && (
                <>
                  <br />
                  {formData.addressLine2}
                </>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">City, State, ZIP</dt>
            <dd className="text-gray-900">
              {formData.city && formData.state && formData.zipCode
                ? `${formData.city}, ${formData.state} ${formData.zipCode}`
                : "Not set"}
            </dd>
          </div>
        </dl>
        <div className="mt-6">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Edit information
          </button>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      {/* Address Line 1 */}
      <div>
        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="addressLine1"
          value={formData.addressLine1}
          onChange={(e) =>
            setFormData({ ...formData, addressLine1: e.target.value })
          }
          placeholder="123 Main St"
          className={`block w-full rounded-md border ${
            fieldErrors.addressLine1 ? "border-red-300" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
          required
        />
        {fieldErrors.addressLine1 && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.addressLine1}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
          Apartment, suite, etc. (optional)
        </label>
        <input
          type="text"
          id="addressLine2"
          value={formData.addressLine2}
          onChange={(e) =>
            setFormData({ ...formData, addressLine2: e.target.value })
          }
          placeholder="Apt 4B"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* City, State, ZIP in a grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* City */}
        <div className="sm:col-span-1">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Charlottesville"
            className={`block w-full rounded-md border ${
              fieldErrors.city ? "border-red-300" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
            required
          />
          {fieldErrors.city && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>
          )}
        </div>

        {/* State */}
        <div className="sm:col-span-1">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className={`block w-full rounded-md border ${
              fieldErrors.state ? "border-red-300" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
            required
          >
            <option value="">Select</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {fieldErrors.state && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.state}</p>
          )}
        </div>

        {/* ZIP Code */}
        <div className="sm:col-span-1">
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) =>
              setFormData({ ...formData, zipCode: e.target.value })
            }
            placeholder="22903"
            className={`block w-full rounded-md border ${
              fieldErrors.zipCode ? "border-red-300" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
            required
          />
          {fieldErrors.zipCode && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.zipCode}</p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
