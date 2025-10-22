"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }
        const data = await response.json();
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading task...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-sm text-red-800">
            {error || "Task not found"}
          </p>
        </div>
        <Link
          href="/app/tasks"
          className="text-primary hover:text-primary-hover font-medium"
        >
          ← Back to tasks
        </Link>
      </div>
    );
  }

  // Create Google Maps search URL
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    task.location
  )}`;

  // Create embedded map URL
  const mapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  }&q=${encodeURIComponent(task.location)}`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/app/tasks"
          className="text-primary hover:text-primary-hover font-medium text-sm"
        >
          ← Back to tasks
        </Link>
      </div>

      {/* Task Header */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {task.category}
              </span>
            </div>
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Posted by {task.createdBy.name || task.createdBy.email}
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(task.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="ml-6 text-right">
            <div className="text-4xl font-bold text-primary">
              ${task.budget.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">budget</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              task.status === "posted"
                ? "bg-green-100 text-green-800"
                : task.status === "accepted"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
      </div>

      {/* Location & Map */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Location</h2>
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 text-primary"
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
          <p className="text-gray-700">{task.location}</p>
        </div>

        {/* Google Maps Integration */}
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <div className="mt-4">
            <iframe
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "0.5rem" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapsEmbedUrl}
            ></iframe>
          </div>
        ) : (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">
              View this location on Google Maps:
            </p>
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open in Google Maps
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Interested?</h2>
        <p className="text-gray-600 mb-4">
          Contact the task poster to discuss details and accept this task.
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-hover transition-colors"
            onClick={() => {
              // TODO: Implement task acceptance workflow
              alert("Task acceptance feature coming soon!");
            }}
          >
            Accept Task
          </button>
          <button
            className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/app/tasks")}
          >
            Back to Browse
          </button>
        </div>
      </div>
    </div>
  );
}
