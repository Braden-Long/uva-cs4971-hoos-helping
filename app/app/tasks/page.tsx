"use client";

import { useEffect, useState, useCallback } from "react";
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
  }, [categoryFilter, locationFilter, minBudgetFilter, maxBudgetFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
                          <span>
                            Posted by{" "}
                            {task.createdBy.name || task.createdBy.email}
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
