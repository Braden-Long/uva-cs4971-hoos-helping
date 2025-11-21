"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { US_STATES, validateUSAddress } from "@/lib/address-validation";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/ui/form-input";

type TaskSummary = {
  id: string;
  title: string;
  category: string;
  location: string;
  budget: number;
  status: string;
};

type FullTask = TaskSummary & {
  description: string;
  scheduledDate: string | null;
  categorySpecificData: Record<string, unknown> | null;
};

export default function NewTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [recentTasks, setRecentTasks] = useState<TaskSummary[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pendingCategoryData, setPendingCategoryData] = useState<Record<
    string,
    unknown
  > | null>(null);

  const fetchUserTasks = async () => {
    try {
      const response = await fetch("/api/my-tasks/posted");
      if (!response.ok) {
        setRecentTasks([]);
        return;
      }
      const data: TaskSummary[] = await response.json();
      const activeTasks = data.filter((task) =>
        ["open", "in_progress"].includes(task.status)
      );
      setRecentTasks(activeTasks.slice(0, 6));
    } catch (fetchError) {
      console.error("Error loading user tasks:", fetchError);
      setRecentTasks([]);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Validate address
    let addressLine1: string;
    let addressLine2: string;
    let city: string;
    let state: string;
    let zipCode: string;
    let locationString: string;

    // Build category-specific data
    const categorySpecificData: Record<string, unknown> = {};

    if (selectedCategory === "Moving") {
      // For moving tasks, validate both starting and ending addresses
      const startAddressLine1 = formData.get("startAddressLine1") as string;
      const startAddressLine2 = formData.get("startAddressLine2") as string;
      const startCity = formData.get("startCity") as string;
      const startState = formData.get("startState") as string;
      const startZipCode = formData.get("startZipCode") as string;

      const endAddressLine1 = formData.get("endAddressLine1") as string;
      const endAddressLine2 = formData.get("endAddressLine2") as string;
      const endCity = formData.get("endCity") as string;
      const endState = formData.get("endState") as string;
      const endZipCode = formData.get("endZipCode") as string;

      // Validate starting address
      const startValidation = validateUSAddress({
        addressLine1: startAddressLine1,
        addressLine2: startAddressLine2,
        city: startCity,
        state: startState,
        zipCode: startZipCode,
      });

      if (!startValidation.valid) {
        setError(
          `Starting address validation failed: ${startValidation.errors.map((e) => e.message).join(", ")}`
        );
        setIsSubmitting(false);
        return;
      }

      // Validate ending address
      const endValidation = validateUSAddress({
        addressLine1: endAddressLine1,
        addressLine2: endAddressLine2,
        city: endCity,
        state: endState,
        zipCode: endZipCode,
      });

      if (!endValidation.valid) {
        setError(
          `Ending address validation failed: ${endValidation.errors.map((e) => e.message).join(", ")}`
        );
        setIsSubmitting(false);
        return;
      }

      // Store addresses in category-specific data
      categorySpecificData.startingAddress = {
        addressLine1: startAddressLine1,
        addressLine2: startAddressLine2,
        city: startCity,
        state: startState,
        zipCode: startZipCode,
      };
      categorySpecificData.endingAddress = {
        addressLine1: endAddressLine1,
        addressLine2: endAddressLine2,
        city: endCity,
        state: endState,
        zipCode: endZipCode,
      };
      categorySpecificData.floors = formData.get("floors");
      categorySpecificData.bedrooms = formData.get("bedrooms");
      categorySpecificData.heavyItems = formData.get("heavyItems") === "on";
      categorySpecificData.requiresCar = formData.get("requiresCar") === "on";

      // Use starting address as the main task location
      addressLine1 = startAddressLine1;
      addressLine2 = startAddressLine2;
      city = startCity;
      state = startState;
      zipCode = startZipCode;
      locationString = `${startAddressLine1}${startAddressLine2 ? ", " + startAddressLine2 : ""}, ${startCity}, ${startState} ${startZipCode} → ${endAddressLine1}, ${endCity}, ${endState}`;
    } else {
      // For non-moving tasks, use the main task location fields
      addressLine1 = formData.get("addressLine1") as string;
      addressLine2 = formData.get("addressLine2") as string;
      city = formData.get("city") as string;
      state = formData.get("state") as string;
      zipCode = formData.get("zipCode") as string;

      const addressValidation = validateUSAddress({
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
      });

      if (!addressValidation.valid) {
        setError(
          `Address validation failed: ${addressValidation.errors.map((e) => e.message).join(", ")}`
        );
        setIsSubmitting(false);
        return;
      }

      locationString = `${addressLine1}${addressLine2 ? ", " + addressLine2 : ""}, ${city}, ${state} ${zipCode}`;

      // Handle other category-specific data
      if (selectedCategory === "Furniture Assembly") {
        categorySpecificData.itemType = formData.get("itemType");
        categorySpecificData.numberOfItems = formData.get("numberOfItems");
        categorySpecificData.bringTools = formData.get("bringTools") === "on";
      } else if (selectedCategory === "Cleaning") {
        categorySpecificData.propertyType = formData.get("propertyType");
        categorySpecificData.numberOfRooms = formData.get("numberOfRooms");
        categorySpecificData.cleaningType = formData.get("cleaningType");
        categorySpecificData.bringSupplies =
          formData.get("bringSupplies") === "on";
      } else if (selectedCategory === "Errands") {
        categorySpecificData.errandType = formData.get("errandType");
        categorySpecificData.requiresCar = formData.get("requiresCar") === "on";
        categorySpecificData.estimatedDuration =
          formData.get("estimatedDuration");
      }
    }

    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      location: locationString,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      budget: formData.get("budget") as string,
      scheduledDate: formData.get("scheduledDate") as string,
      categorySpecificData:
        Object.keys(categorySpecificData).length > 0
          ? categorySpecificData
          : null,
    };

    try {
      const endpoint = editingTaskId
        ? `/api/tasks/${editingTaskId}`
        : "/api/tasks";
      const method = editingTaskId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      if (editingTaskId) {
        await fetchUserTasks();
        resetForm();
        setIsSubmitting(false);
      } else {
        router.push("/app/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  const handleSelectTask = async (taskId: string) => {
    setLoadingTaskId(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) throw new Error("Failed to load task");
      const data: FullTask = await response.json();
      setEditingTaskId(taskId);
      setSelectedCategory(data.category);
      populateForm(data);
      setPendingCategoryData(data.categorySpecificData || null);
    } catch (err) {
      console.error("Failed to load task", err);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const resetForm = () => {
    formRef.current?.reset();
    setSelectedCategory("");
    setEditingTaskId(null);
    setPendingCategoryData(null);
  };

  const setFieldValue = (name: string, value: string | boolean | null) => {
    const form = formRef.current;
    if (!form) return;
    const element = form.elements.namedItem(name);
    if (!element) return;
    if (element instanceof HTMLInputElement) {
      if (element.type === "checkbox") {
        element.checked = Boolean(value);
      } else {
        element.value = value != null ? String(value) : "";
      }
    } else if (
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
    ) {
      element.value = value != null ? String(value) : "";
    }
  };

  const populateForm = (taskData: FullTask) => {
    setFieldValue("title", taskData.title || "");
    setFieldValue("description", taskData.description || "");
    setFieldValue("category", taskData.category || "");
    setFieldValue("scheduledDate", formatDateForInput(taskData.scheduledDate));
    setFieldValue("location", taskData.location || "");
    setFieldValue("budget", taskData.budget?.toString() || "");
  };

  useEffect(() => {
    if (!pendingCategoryData) return;
    Object.entries(pendingCategoryData).forEach(([key, value]) => {
      setFieldValue(key, value as string | boolean | null);
    });
    setPendingCategoryData(null);
  }, [pendingCategoryData, selectedCategory]);

  const formatDateForInput = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  const renderCategorySpecificFields = () => {
    switch (selectedCategory) {
      case "Moving":
        return (
          <div className="space-y-4 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900">Moving Details</h3>

            {/* Starting Address */}
            <div className="space-y-3 border-b border-blue-200 pb-4">
              <h4 className="text-sm font-semibold text-gray-900">
                Starting Address (Pickup)
              </h4>

              <FormInput
                label="Street Address *"
                type="text"
                name="startAddressLine1"
                required
                placeholder="123 Main St"
              />

              <FormInput
                label="Apartment, suite, etc. (optional)"
                type="text"
                name="startAddressLine2"
                placeholder="Apt 4B"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <FormInput
                    label="City *"
                    type="text"
                    name="startCity"
                    required
                    placeholder="Charlottesville"
                  />
                </div>

                <div>
                  <FormSelect label="State *" name="startState" required>
                    <option value="">Select</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </FormSelect>
                </div>

                <div>
                  <FormInput
                    label="ZIP *"
                    type="text"
                    name="startZipCode"
                    required
                    placeholder="22903"
                  />
                </div>
              </div>
            </div>

            {/* Ending Address */}
            <div className="space-y-3 border-b border-blue-200 pb-4">
              <h4 className="text-sm font-semibold text-gray-900">
                Ending Address (Drop-off)
              </h4>

              <FormInput
                label="Street Address *"
                type="text"
                name="endAddressLine1"
                required
                placeholder="456 Oak Ave"
              />

              <FormInput
                label="Apartment, suite, etc. (optional)"
                type="text"
                name="endAddressLine2"
                placeholder="Unit 2C"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <FormInput
                    label="City *"
                    type="text"
                    name="endCity"
                    required
                    placeholder="Charlottesville"
                  />
                </div>

                <div>
                  <FormSelect label="State *" name="endState" required>
                    <option value="">Select</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </FormSelect>
                </div>

                <div>
                  <FormInput
                    label="ZIP *"
                    type="text"
                    name="endZipCode"
                    required
                    placeholder="22903"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormSelect label="Floors (Pickup)" name="floors">
                  <option value="1">1st Floor</option>
                  <option value="2">2nd Floor</option>
                  <option value="3">3rd Floor+</option>
                </FormSelect>
              </div>

              <div>
                <FormInput
                  label="Bedrooms"
                  type="text"
                  name="bedrooms"
                  placeholder="e.g., Studio, 1BR, 2BR"
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
                <span className="text-sm text-gray-700">
                  Heavy items (furniture, appliances)
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="requiresCar"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  Helper must have a truck
                </span>
              </label>
            </div>
          </div>
        );

      case "Furniture Assembly":
        return (
          <div className="space-y-4 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900">Assembly Details</h3>

            <FormInput
              label="Item Type"
              type="text"
              name="itemType"
              required
              placeholder="e.g., IKEA desk, bookshelf, bed frame"
            />

            <FormInput
              label="Number of Items"
              type="number"
              name="numberOfItems"
              min="1"
              defaultValue="1"
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="bringTools"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                Helper should bring tools
              </span>
            </label>
          </div>
        );

      case "Cleaning":
        return (
          <div className="space-y-4 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900">Cleaning Details</h3>

            <FormSelect label="Property Type" name="propertyType">
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="dorm">Dorm Room</option>
              <option value="office">Office</option>
            </FormSelect>

            <FormInput
              label="Number of Rooms/Size"
              type="text"
              name="numberOfRooms"
              placeholder="e.g., 2 bedrooms, 1 bathroom"
            />

            <FormSelect label="Cleaning Type" name="cleaningType">
              <option value="regular">Regular Cleaning</option>
              <option value="deep">Deep Cleaning</option>
              <option value="moveout">Move-out Cleaning</option>
            </FormSelect>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="bringSupplies"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                Helper should bring cleaning supplies
              </span>
            </label>
          </div>
        );

      case "Errands":
        return (
          <div className="space-y-4 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900">Errand Details</h3>

            <FormInput
              label="Type of Errand"
              type="text"
              name="errandType"
              required
              placeholder="e.g., Grocery shopping, mail drop-off, package pickup"
            />

            <FormInput
              label="Estimated Duration"
              type="text"
              name="estimatedDuration"
              placeholder="e.g., 1 hour, 2-3 hours"
            />

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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {editingTaskId ? "Update your task" : "Post a Task"}
          </h1>
          <p className="mt-2 text-gray-600">
            {editingTaskId
              ? "Make edits and keep helpers in the loop."
              : "Describe what you need help with and connect with trusted helpers."}
          </p>
        </div>
        {editingTaskId && (
          <button
            type="button"
            onClick={resetForm}
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Cancel editing
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-md bg-white px-6 py-6 shadow-sm">
            {error && (
              <Alert variant="error" className="mb-6">
                {error}
              </Alert>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <FormInput
                label="Task Title"
                type="text"
                name="title"
                id="title"
                required
                placeholder="e.g., Help moving furniture"
              />

              {/* Category */}
              <FormSelect
                label="Category"
                name="category"
                id="category"
                required
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
              </FormSelect>

              {/* Category-Specific Fields */}
              {renderCategorySpecificFields()}

              {/* Description */}
              <FormTextarea
                label="Description"
                name="description"
                id="description"
                required
                rows={4}
                placeholder="Provide details about the task, what needs to be done, and any special requirements..."
              />

              {/* Scheduled Date */}
              <FormInput
                label="When do you need this done?"
                type="datetime-local"
                name="scheduledDate"
                id="scheduledDate"
                helperText="Optional - leave blank if flexible"
              />

              {/* Location - Structured Address (hidden for Moving tasks) */}
              {selectedCategory !== "Moving" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Task Location
                  </h3>

                  {/* Address Line 1 */}
                  <FormInput
                    label="Street Address *"
                    type="text"
                    name="addressLine1"
                    id="addressLine1"
                    required
                    placeholder="123 Main St"
                  />

                  {/* Address Line 2 */}
                  <FormInput
                    label="Apartment, suite, etc. (optional)"
                    type="text"
                    name="addressLine2"
                    id="addressLine2"
                    placeholder="Apt 4B"
                  />

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <FormInput
                        label="City *"
                        type="text"
                        name="city"
                        id="city"
                        required
                        placeholder="Charlottesville"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <FormSelect
                        label="State *"
                        name="state"
                        id="state"
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

                    <div className="sm:col-span-1">
                      <FormInput
                        label="ZIP Code *"
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        required
                        placeholder="22903"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Budget */}
              <FormInput
                label="Budget ($)"
                type="number"
                name="budget"
                id="budget"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                helperText="How much are you willing to pay for this task?"
              />

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} fullWidth>
                  {editingTaskId
                    ? isSubmitting
                      ? "Saving..."
                      : "Save changes"
                    : isSubmitting
                      ? "Creating..."
                      : "Post Task"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    editingTaskId ? resetForm() : router.push("/app/dashboard")
                  }
                >
                  {editingTaskId ? "Discard" : "Cancel"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md bg-white px-6 py-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Your active tasks
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Drafting a similar task? Here are the ones you&apos;re currently
              running.
            </p>
            <ul role="list" className="mt-4 space-y-3">
              {recentTasks.length === 0 ? (
                <li className="text-sm text-gray-500">
                  You don&apos;t have any open or in-progress tasks yet.
                </li>
              ) : (
                recentTasks.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectTask(task.id)}
                      className={`w-full rounded-md border px-4 py-3 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        editingTaskId === task.id
                          ? "border-primary/60 bg-primary/5"
                          : "border-gray-100 hover:border-primary/40 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {task.title}
                          </p>
                          <p className="text-gray-500">
                            {task.category} • {task.location}
                          </p>
                          <p className="text-xs font-medium uppercase text-gray-400">
                            {task.status.replace("_", " ")}
                          </p>
                        </div>
                        <span className="text-primary font-semibold">
                          {loadingTaskId === task.id
                            ? "Loading…"
                            : `$${task.budget.toFixed(2)}`}
                        </span>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="mt-4 text-right text-sm">
              <Link
                href="/app/tasks"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                View all tasks →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
