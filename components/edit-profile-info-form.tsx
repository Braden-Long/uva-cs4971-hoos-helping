"use client";

import { useState, useEffect } from "react";
import { US_STATES } from "@/lib/address-validation";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import { FormInput, FormSelect } from "@/components/ui/form-input";
import { InlineLoader } from "@/components/ui/loading-spinner";

interface EditProfileInfoFormProps {
  onSuccess?: () => void;
}

export default function EditProfileInfoForm({
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
          data.errors.forEach((err: { field: string; message: string }) => {
            errors[err.field] = err.message;
          });
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
    return <InlineLoader />;
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
            <dt className="text-sm font-medium text-gray-600">
              Street address
            </dt>
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
            <dt className="text-sm font-medium text-gray-600">
              City, State, ZIP
            </dt>
            <dd className="text-gray-900">
              {formData.city && formData.state && formData.zipCode
                ? `${formData.city}, ${formData.state} ${formData.zipCode}`
                : "Not set"}
            </dd>
          </div>
        </dl>
        <div className="mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit information
          </Button>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      {/* Name */}
      <FormInput
        label="Full Name *"
        type="text"
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      {/* Address Line 1 */}
      <FormInput
        label="Street Address *"
        type="text"
        id="addressLine1"
        value={formData.addressLine1}
        onChange={(e) =>
          setFormData({ ...formData, addressLine1: e.target.value })
        }
        placeholder="123 Main St"
        error={fieldErrors.addressLine1}
        required
      />

      {/* Address Line 2 */}
      <FormInput
        label="Apartment, suite, etc. (optional)"
        type="text"
        id="addressLine2"
        value={formData.addressLine2}
        onChange={(e) =>
          setFormData({ ...formData, addressLine2: e.target.value })
        }
        placeholder="Apt 4B"
      />

      {/* City, State, ZIP in a grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* City */}
        <div className="sm:col-span-1">
          <FormInput
            label="City *"
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Charlottesville"
            error={fieldErrors.city}
            required
          />
        </div>

        {/* State */}
        <div className="sm:col-span-1">
          <FormSelect
            label="State *"
            id="state"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            error={fieldErrors.state}
            required
          >
            <option value="">Select</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </FormSelect>
        </div>

        {/* ZIP Code */}
        <div className="sm:col-span-1">
          <FormInput
            label="ZIP Code *"
            type="text"
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) =>
              setFormData({ ...formData, zipCode: e.target.value })
            }
            placeholder="22903"
            error={fieldErrors.zipCode}
            required
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
