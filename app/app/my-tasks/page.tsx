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
  const [activeTab, setActiveTab] = useState<"posted" | "applied" | "assigned">("posted");
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
      <div className="border-b mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("posted")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "posted"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Posted by Me ({postedTasks.length})
          </button>
          <button
            onClick={() => setActiveTab("applied")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "applied"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab("assigned")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "assigned"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
            <div className="text-center py-12 bg-white border rounded-lg">
              <p className="text-gray-600 mb-4">You haven&apos;t posted any tasks yet.</p>
              <Link
                href="/app/tasks/new"
                className="inline-block bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-hover"
              >
                Post Your First Task
              </Link>
            </div>
          ) : (
            postedTasks.map((task) => (
              <Link
                key={task.id}
                href={`/app/tasks/${task.id}`}
                className="block bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
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
                  <div className="ml-6 text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${task.budget.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {activeTab === "applied" && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-12 bg-white border rounded-lg">
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
            applications.map((application) => (
              <div
                key={application.id}
                className="bg-white border rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        <Link
                          href={`/app/tasks/${application.task.id}`}
                          className="hover:text-primary"
                        >
                          {application.task.title}
                        </Link>
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {application.task.category} • {application.task.location}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ${application.task.budget.toFixed(2)}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Your message:</p>
                  <p className="text-gray-700">{application.message}</p>
                  {application.proposedRate && (
                    <p className="text-sm text-gray-600 mt-2">
                      Proposed rate: ${application.proposedRate.toFixed(2)}/hour
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "assigned" && (
        <div className="space-y-4">
          {assignedTasks.length === 0 ? (
            <div className="text-center py-12 bg-white border rounded-lg">
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
            assignedTasks.map((task) => (
              <Link
                key={task.id}
                href={`/app/tasks/${task.id}`}
                className="block bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{task.category}</span>
                      <span>{task.location}</span>
                      {task.createdBy && (
                        <span>
                          Posted by {task.createdBy.name || task.createdBy.email}
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
                  <div className="ml-6 text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${task.budget.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
