"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  status: string;
  scheduledDate: string | null;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string | null;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string | null;
    email: string;
  };
  _count?: {
    applications: number;
  };
}

interface Application {
  id: string;
  status: string;
  message: string;
  proposedRate: number | null;
  createdAt: string;
  task: Task;
}

export default function MyTasksPage() {
  const [activeTab, setActiveTab] = useState<"posted" | "applied" | "assigned">(
    "posted"
  );
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postedRes, applicationsRes, assignedRes] = await Promise.all([
        fetch("/api/my-tasks/posted"),
        fetch("/api/my-tasks/applications"),
        fetch("/api/my-tasks/assigned"),
      ]);

      if (postedRes.ok) {
        const data = await postedRes.json();
        setPostedTasks(data);
      }

      if (applicationsRes.ok) {
        const data = await applicationsRes.json();
        setApplications(data);
      }

      if (assignedRes.ok) {
        const data = await assignedRes.json();
        setAssignedTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab("posted")}
            className={`rounded-t-md px-4 py-2 text-sm font-semibold cursor-pointer ${
              activeTab === "posted"
                ? "border-b-2 border-primary text-gray-900"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Posted by Me ({postedTasks.length})
          </button>
          <button
            onClick={() => setActiveTab("applied")}
            className={`rounded-t-md px-4 py-2 text-sm font-semibold cursor-pointer ${
              activeTab === "applied"
                ? "border-b-2 border-primary text-gray-900"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            My Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab("assigned")}
            className={`rounded-t-md px-4 py-2 text-sm font-semibold cursor-pointer ${
              activeTab === "assigned"
                ? "border-b-2 border-primary text-gray-900"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Assigned to Me ({assignedTasks.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "posted" && (
        <div className="space-y-4">
          {postedTasks.length === 0 ? (
            <div className="text-center py-12 rounded-md bg-white px-6 shadow-sm">
              <p className="text-gray-600 mb-4">
                You haven&apos;t posted any tasks yet.
              </p>
              <Link
                href="/app/tasks/new"
                className="inline-block bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-hover"
              >
                Post Your First Task
              </Link>
            </div>
          ) : (
            <ul role="list" className="space-y-3">
              {postedTasks.map((task) => (
                <li
                  key={task.id}
                  className="overflow-hidden rounded-md bg-white px-6 py-4 shadow-sm transition hover:shadow-md"
                >
                  <Link href={`/app/tasks/${task.id}`} className="block">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {task.title}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>{task.category}</span>
                          <span>{task.location}</span>
                          {task._count && task._count.applications > 0 && (
                            <span className="text-primary font-medium">
                              {task._count.applications} application
                              {task._count.applications !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${task.budget.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "applied" && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-12 rounded-md bg-white px-6 shadow-sm">
              <p className="text-gray-600 mb-4">
                You haven&apos;t applied to any tasks yet.
              </p>
              <Link
                href="/app/tasks"
                className="inline-block bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-hover"
              >
                Browse Available Tasks
              </Link>
            </div>
          ) : (
            <ul role="list" className="space-y-3">
              {applications.map((application) => (
                <li
                  key={application.id}
                  className="overflow-hidden rounded-md bg-white px-6 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          <Link
                            href={`/app/tasks/${application.task.id}`}
                            className="hover:text-primary"
                          >
                            {application.task.title}
                          </Link>
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {application.task.category} •{" "}
                        {application.task.location}
                      </p>
                      <div className="border-t pt-3 text-sm text-gray-700">
                        <p className="font-medium text-gray-600 mb-1">
                          Your message:
                        </p>
                        <p>{application.message}</p>
                        {application.proposedRate && (
                          <p className="text-gray-600 mt-2">
                            Proposed rate: $
                            {application.proposedRate.toFixed(2)}/hour
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${application.task.budget.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "assigned" && (
        <div className="space-y-4">
          {assignedTasks.length === 0 ? (
            <div className="text-center py-12 rounded-md bg-white px-6 shadow-sm">
              <p className="text-gray-600 mb-4">
                You don&apos;t have any assigned tasks yet.
              </p>
              <Link
                href="/app/tasks"
                className="inline-block bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-hover"
              >
                Browse Available Tasks
              </Link>
            </div>
          ) : (
            <ul role="list" className="space-y-3">
              {assignedTasks.map((task) => (
                <li
                  key={task.id}
                  className="overflow-hidden rounded-md bg-white px-6 py-4 shadow-sm transition hover:shadow-md"
                >
                  <Link href={`/app/tasks/${task.id}`} className="block">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {task.title}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>{task.category}</span>
                          <span>{task.location}</span>
                          {task.createdBy && (
                            <span>
                              Posted by{" "}
                              {task.createdBy.name || task.createdBy.email}
                            </span>
                          )}
                        </div>
                        {task.scheduledDate && (
                          <p className="text-sm text-gray-600 mt-2">
                            Scheduled:{" "}
                            {new Date(task.scheduledDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${task.budget.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
