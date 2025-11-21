"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Moving",
  "Furniture Assembly",
  "Cleaning",
  "Errands",
  "Pet Sitting",
  "Yard Work",
  "Tutoring",
  "Other",
];

export default function HelperOnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hasCar, setHasCar] = useState(false);
  const [bio, setBio] = useState("");

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      bio,
      skills: selectedSkills,
      hasCar,
      hourlyRate: formData.get("hourlyRate") as string,
    };

    if (selectedSkills.length === 0) {
      setError("Please select at least one skill");
      setIsSubmitting(false);
      return;
    }

    if (bio.trim().length < 20) {
      setError("Bio must be at least 20 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/users/helper-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save helper profile");
      }

      router.push("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Become a Helper
          </h1>
          <p className="text-gray-600">
            Set up your helper profile to start earning money by helping others
            in the UVA community
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-8 space-y-6"
        >
          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              About You <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              id="bio"
              required
              minLength={20}
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people a bit about yourself, your experience, and why you'd be a great helper..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Required for background verification (minimum 20 characters)
              </p>
              <p
                className={`text-sm font-medium ${
                  bio.trim().length >= 20
                    ? "text-green-600"
                    : bio.trim().length > 0
                      ? "text-yellow-600"
                      : "text-gray-500"
                }`}
              >
                {bio.trim().length}/20
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What can you help with? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleSkill(category)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                    selectedSkills.includes(category)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select all that apply ({selectedSkills.length} selected)
            </p>
          </div>

          {/* Has Car */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCar}
                onChange={(e) => setHasCar(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                I have a car available for tasks
              </span>
            </label>
            <p className="mt-1 ml-8 text-sm text-gray-500">
              This will help you get matched with tasks that require
              transportation
            </p>
          </div>

          {/* Hourly Rate */}
          <div>
            <label
              htmlFor="hourlyRate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hourly Rate (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                name="hourlyRate"
                id="hourlyRate"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Set a default hourly rate. You can adjust this for individual
              tasks.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white px-4 py-3 rounded-md font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Complete Setup"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/app/dashboard")}
              className="px-4 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
