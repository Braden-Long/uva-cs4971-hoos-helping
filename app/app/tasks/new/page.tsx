"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Build category-specific data
    const categorySpecificData: Record<string, unknown> = {};

    if (selectedCategory === "Moving") {
      categorySpecificData.startingAddress = formData.get("startingAddress");
      categorySpecificData.endingAddress = formData.get("endingAddress");
      categorySpecificData.floors = formData.get("floors");
      categorySpecificData.bedrooms = formData.get("bedrooms");
      categorySpecificData.heavyItems = formData.get("heavyItems") === "on";
      categorySpecificData.requiresCar = formData.get("requiresCar") === "on";
    } else if (selectedCategory === "Furniture Assembly") {
      categorySpecificData.itemType = formData.get("itemType");
      categorySpecificData.numberOfItems = formData.get("numberOfItems");
      categorySpecificData.bringTools = formData.get("bringTools") === "on";
    } else if (selectedCategory === "Cleaning") {
      categorySpecificData.propertyType = formData.get("propertyType");
      categorySpecificData.numberOfRooms = formData.get("numberOfRooms");
      categorySpecificData.cleaningType = formData.get("cleaningType");
      categorySpecificData.bringSupplies = formData.get("bringSupplies") === "on";
    } else if (selectedCategory === "Errands") {
      categorySpecificData.errandType = formData.get("errandType");
      categorySpecificData.requiresCar = formData.get("requiresCar") === "on";
      categorySpecificData.estimatedDuration = formData.get("estimatedDuration");
    }

    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      budget: formData.get("budget") as string,
      scheduledDate: formData.get("scheduledDate") as string,
      categorySpecificData: Object.keys(categorySpecificData).length > 0 ? categorySpecificData : null,
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      router.push("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  const renderCategorySpecificFields = () => {
    switch (selectedCategory) {
      case "Moving":
        return (
          <div className="space-y-4 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900">Moving Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Starting Address
              </label>
              <input
                type="text"
                name="startingAddress"
                required
                placeholder="123 Main St, Charlottesville, VA"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ending Address
              </label>
              <input
                type="text"
                name="endingAddress"
                required
                placeholder="456 Oak Ave, Charlottesville, VA"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Floors (Pickup)
                </label>
                <select
                  name="floors"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="1">1st Floor</option>
                  <option value="2">2nd Floor</option>
                  <option value="3">3rd Floor+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bedrooms
                </label>
                <input
                  type="text"
                  name="bedrooms"
                  placeholder="e.g., Studio, 1BR, 2BR"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="heavyItems"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Heavy items (furniture, appliances)</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="requiresCar"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Helper must have a car</span>
              </label>
            </div>
          </div>
        );

      case "Furniture Assembly":
        return (
          <div className="space-y-4 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900">Assembly Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Type
              </label>
              <input
                type="text"
                name="itemType"
                required
                placeholder="e.g., IKEA desk, bookshelf, bed frame"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Items
              </label>
              <input
                type="number"
                name="numberOfItems"
                min="1"
                defaultValue="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="bringTools"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Helper should bring tools</span>
            </label>
          </div>
        );

      case "Cleaning":
        return (
          <div className="space-y-4 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900">Cleaning Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                name="propertyType"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="dorm">Dorm Room</option>
                <option value="office">Office</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Rooms/Size
              </label>
              <input
                type="text"
                name="numberOfRooms"
                placeholder="e.g., 2 bedrooms, 1 bathroom"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cleaning Type
              </label>
              <select
                name="cleaningType"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="regular">Regular Cleaning</option>
                <option value="deep">Deep Cleaning</option>
                <option value="moveout">Move-out Cleaning</option>
              </select>
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="bringSupplies"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Helper should bring cleaning supplies</span>
            </label>
          </div>
        );

      case "Errands":
        return (
          <div className="space-y-4 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900">Errand Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type of Errand
              </label>
              <input
                type="text"
                name="errandType"
                required
                placeholder="e.g., Grocery shopping, mail drop-off, package pickup"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estimated Duration
              </label>
              <input
                type="text"
                name="estimatedDuration"
                placeholder="e.g., 1 hour, 2-3 hours"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="requiresCar"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Requires a car</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post a Task</h1>
        <p className="mt-2 text-gray-600">
          Describe what you need help with and connect with trusted helpers in
          the UVA and Charlottesville community.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Task Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            placeholder="e.g., Help moving furniture"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            required
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select a category</option>
            <option value="Moving">Moving</option>
            <option value="Furniture Assembly">Furniture Assembly</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Errands">Errands</option>
            <option value="Pet Sitting">Pet Sitting</option>
            <option value="Yard Work">Yard Work</option>
            <option value="Tutoring">Tutoring</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Category-Specific Fields */}
        {renderCategorySpecificFields()}

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            required
            rows={4}
            placeholder="Provide details about the task, what needs to be done, and any special requirements..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Scheduled Date */}
        <div>
          <label
            htmlFor="scheduledDate"
            className="block text-sm font-medium text-gray-700"
          >
            When do you need this done?
          </label>
          <input
            type="datetime-local"
            name="scheduledDate"
            id="scheduledDate"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional - leave blank if flexible
          </p>
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            placeholder="e.g., 123 Main St, Charlottesville, VA or UVA Grounds"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-sm text-gray-500">
            General area where the task will take place
          </p>
        </div>

        {/* Budget */}
        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700"
          >
            Budget ($)
          </label>
          <input
            type="number"
            name="budget"
            id="budget"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-sm text-gray-500">
            How much are you willing to pay for this task?
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Post Task"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/app/dashboard")}
            className="px-4 py-2 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
