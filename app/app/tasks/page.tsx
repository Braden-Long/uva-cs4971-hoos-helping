"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  const fetchTasks = async () => {
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
  };

  useEffect(() => {
    fetchTasks();
  }, [categoryFilter, locationFilter, minBudgetFilter, maxBudgetFilter]);

  const handleResetFilters = () => {
    setCategoryFilter("all");
    setLocationFilter("");
    setMinBudgetFilter("");
    setMaxBudgetFilter("");
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
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              <option value="Moving">Moving</option>
              <option value="Errands">Errands</option>
              <option value="Pet Sitting">Pet Sitting</option>
              <option value="Assembly">Assembly</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Yard Work">Yard Work</option>
              <option value="Tutoring">Tutoring</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Search by location..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Min Budget Filter */}
          <div>
            <label
              htmlFor="minBudget"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Min Budget ($)
            </label>
            <input
              type="number"
              id="minBudget"
              value={minBudgetFilter}
              onChange={(e) => setMinBudgetFilter(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Max Budget Filter */}
          <div>
            <label
              htmlFor="maxBudget"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max Budget ($)
            </label>
            <input
              type="number"
              id="maxBudget"
              value={maxBudgetFilter}
              onChange={(e) => setMaxBudgetFilter(e.target.value)}
              placeholder="Any"
              min="0"
              step="0.01"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleResetFilters}
            className="text-sm text-primary hover:text-primary-hover font-medium"
          >
            Reset Filters
          </button>
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
            <div className="grid gap-6">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/app/tasks/${task.id}`}
                  className="block bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {task.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {task.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Posted by{" "}
                          {task.createdBy.name || task.createdBy.email}
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${task.budget.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">budget</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
