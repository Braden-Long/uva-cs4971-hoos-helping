"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import UvaBadge from "@/components/uva-badge";
import BgVerifiedBadge from "@/components/bg-verified-badge";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  status: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    isUvaVerified: boolean;
    isBackgroundVerified: boolean;
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [minBudgetFilter, setMinBudgetFilter] = useState("");
  const [maxBudgetFilter, setMaxBudgetFilter] = useState("");
  const [uvaVerifiedFilter, setUvaVerifiedFilter] = useState(false);
  const [backgroundVerifiedFilter, setBackgroundVerifiedFilter] =
    useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (categoryFilter && categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }
      if (locationFilter) {
        params.append("location", locationFilter);
      }
      if (minBudgetFilter) {
        params.append("minBudget", minBudgetFilter);
      }
      if (maxBudgetFilter) {
        params.append("maxBudget", maxBudgetFilter);
      }
      if (uvaVerifiedFilter) {
        params.append("uvaVerified", "true");
      }
      if (backgroundVerifiedFilter) {
        params.append("backgroundVerified", "true");
      }

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [
    categoryFilter,
    locationFilter,
    minBudgetFilter,
    maxBudgetFilter,
    uvaVerifiedFilter,
    backgroundVerifiedFilter,
  ]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleResetFilters = () => {
    setCategoryFilter("all");
    setLocationFilter("");
    setMinBudgetFilter("");
    setMaxBudgetFilter("");
    setUvaVerifiedFilter(false);
    setBackgroundVerifiedFilter(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Tasks</h1>
        <p className="mt-2 text-gray-600">
          Find tasks in the UVA and Charlottesville community that match your
          skills and schedule.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 overflow-hidden rounded-md bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
              Filters
            </p>
            <h2 className="text-lg font-semibold text-gray-900">
              Narrow your search
            </h2>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Reset all
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
            Category
            <div className="relative">
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-[38px] w-full appearance-none rounded-md border border-gray-300 bg-white px-3 pr-10 text-sm font-semibold text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All categories</option>
                <option value="Moving">Moving</option>
                <option value="Errands">Errands</option>
                <option value="Pet Sitting">Pet Sitting</option>
                <option value="Assembly">Assembly</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Yard Work">Yard Work</option>
                <option value="Tutoring">Tutoring</option>
                <option value="Other">Other</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg
                  viewBox="0 0 12 8"
                  width="12"
                  height="8"
                  fill="none"
                  className="stroke-current"
                >
                  <path
                    d="M1 1.5 6 6l5-4.5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Location
            <input
              type="text"
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="e.g., Charlottesville"
              className="h-[38px] rounded-md border border-gray-300 px-3 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Min budget ($)
            <input
              type="number"
              id="minBudget"
              value={minBudgetFilter}
              onChange={(e) => setMinBudgetFilter(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="h-[38px] rounded-md border border-gray-300 px-3 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Max budget ($)
            <input
              type="number"
              id="maxBudget"
              value={maxBudgetFilter}
              onChange={(e) => setMaxBudgetFilter(e.target.value)}
              placeholder="Any"
              min="0"
              step="0.01"
              className="h-[38px] rounded-md border border-gray-300 px-3 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={uvaVerifiedFilter}
              onChange={(e) => setUvaVerifiedFilter(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Show only UVA verified users</span>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={backgroundVerifiedFilter}
              onChange={(e) => setBackgroundVerifiedFilter(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Show only background verified users</span>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      )}

      {/* Tasks List */}
      {!loading && !error && (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-white border rounded-lg">
              <p className="text-gray-600 mb-4">
                No tasks found matching your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="text-primary hover:text-primary-hover font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul role="list" className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="overflow-hidden rounded-md bg-white px-6 py-4 shadow-sm transition hover:shadow-md"
                >
                  <Link href={`/app/tasks/${task.id}`} className="block">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                          <span>{task.location}</span>
                          <span className="flex items-center gap-1.5">
                            Posted by{" "}
                            {task.createdBy.name || task.createdBy.email}
                            {task.createdBy.isUvaVerified && (
                              <UvaBadge className="ml-2" />
                            )}
                            {task.createdBy.isBackgroundVerified && (
                              <BgVerifiedBadge className="ml-2" />
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${task.budget.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">budget</div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
