"use client";

import { useEffect, useMemo, useState } from "react";
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

const STATUS_ORDER: Record<string, number> = {
  open: 1,
  assigned: 2,
  in_progress: 3,
  completed: 4,
  pending: 5,
  accepted: 6,
  rejected: 7,
};

const sortTasks = (tasks: Task[]) =>
  [...tasks].sort((a, b) => {
    const orderA = STATUS_ORDER[a.status] ?? 99;
    const orderB = STATUS_ORDER[b.status] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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

export default function MyTasksPage() {
  const [activeTab, setActiveTab] = useState<"posted" | "applied" | "assigned">(
    "posted"
  );
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postedRes, applicationsRes, assignedRes] = await Promise.all([
          fetch("/api/my-tasks/posted"),
          fetch("/api/my-tasks/applications"),
          fetch("/api/my-tasks/assigned"),
        ]);

        if (postedRes.ok) setPostedTasks(await postedRes.json());
        if (applicationsRes.ok) setApplications(await applicationsRes.json());
        if (assignedRes.ok) setAssignedTasks(await assignedRes.json());
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterTasks = (tasks: Task[]) => {
    const filtered =
      statusFilter === "all"
        ? tasks
        : tasks.filter((task) => task.status === statusFilter);
    return sortTasks(filtered);
  };

  const filteredApplications = useMemo(() => {
    const mappedTasks: Task[] = applications.map((application) => ({
      ...application.task,
      status: application.status,
      createdAt: application.createdAt,
    }));

    const filtered =
      statusFilter === "all"
        ? mappedTasks
        : mappedTasks.filter((task) => task.status === statusFilter);

    return sortTasks(filtered);
  }, [applications, statusFilter]);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="mt-4 text-gray-600">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Dashboard</p>
          <h1 className="text-3xl font-bold text-gray-900">My tasks</h1>
          <p className="text-sm text-gray-500">
            Track work you’ve posted, applied to, or been assigned.
          </p>
        </div>
        <div className="rounded-full border border-gray-200 px-4 py-1 text-sm text-gray-600">
          {filterTasks(postedTasks).length} posted · {applications.length}{" "}
          applied · {filterTasks(assignedTasks).length} assigned
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <nav className="-mb-px flex flex-wrap gap-4 border-b border-gray-200 flex-1">
          {[
            { key: "posted", label: "Posted by me", count: postedTasks.length },
            {
              key: "applied",
              label: "My applications",
              count: applications.length,
            },
            {
              key: "assigned",
              label: "Assigned to me",
              count: assignedTasks.length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`cursor-pointer rounded-t-md px-4 py-2 text-sm font-semibold ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-gray-900"
                  : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <label
            className="text-sm font-semibold text-gray-700"
            htmlFor="statusFilter"
          >
            Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {activeTab === "posted" && (
        <TaskList
          tasks={filterTasks(postedTasks)}
          emptyMessage="You haven't posted any tasks yet."
          cta={{ href: "/app/tasks/new", label: "Post a task" }}
        />
      )}

      {activeTab === "applied" && (
        <TaskList
          tasks={filteredApplications}
          emptyMessage="You haven't applied to any tasks yet."
          cta={{ href: "/app/tasks", label: "Browse available tasks" }}
        />
      )}

      {activeTab === "assigned" && (
        <TaskList
          tasks={filterTasks(assignedTasks)}
          emptyMessage="You don't have any assigned tasks yet."
          cta={{ href: "/app/tasks", label: "Browse available tasks" }}
        />
      )}
    </div>
  );
}

interface TaskListProps {
  tasks: Task[];
  emptyMessage: string;
  cta: { href: string; label: string };
}

function TaskList({ tasks, emptyMessage, cta }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-md bg-white px-6 py-12 text-center shadow-sm">
        <p className="mb-4 text-gray-600">{emptyMessage}</p>
        <Link
          href={cta.href}
          className="inline-block rounded-md bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-hover"
        >
          {cta.label}
        </Link>
      </div>
    );
  }

  return (
    <ul role="list" className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="overflow-hidden rounded-md bg-white px-6 py-4 shadow-sm transition hover:shadow-md"
        >
          <Link href={`/app/tasks/${task.id}`} className="block">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
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
                <p className="mb-2 text-gray-600 line-clamp-2">
                  {task.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span>{task.category}</span>
                  <span>{task.location}</span>
                </div>
                {task.scheduledDate && (
                  <p className="mt-2 text-sm text-gray-500">
                    Scheduled: {new Date(task.scheduledDate).toLocaleString()}
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
  );
}
