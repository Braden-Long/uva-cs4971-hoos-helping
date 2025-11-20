"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
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
  scheduledDate: string | null;
  categorySpecificData: Record<string, unknown> | null;
  createdAt: string;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    isUvaVerified: boolean;
    isBackgroundVerified: boolean;
  };
  assignedTo?: {
    id: string;
    name: string | null;
    email: string;
    isUvaVerified: boolean;
    isBackgroundVerified: boolean;
  };
}

interface Application {
  id: string;
  message: string;
  proposedRate: number | null;
  status: string;
  createdAt: string;
  helper: {
    id: string;
    name: string | null;
    email: string;
    bio: string | null;
    skills: string[];
    hasCar: boolean;
    hourlyRate: number | null;
    averageRating: number | null;
    totalTasksAsHelper: number;
  };
}

interface PosterProfile {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  isUvaVerified: boolean;
  isBackgroundVerified: boolean;
  averageRating: number | null;
  totalTasksPosted: number;
  recentCompletedTasks: Array<{
    id: string;
    title: string;
    category: string;
    budget: number;
    completedAt: string;
  }>;
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
      name: string | null;
      email: string;
    };
  }>;
}

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [posterProfile, setPosterProfile] = useState<PosterProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/applications`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  }, [taskId]);

  const checkReviewStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/review`);
      if (response.ok) {
        const data = await response.json();
        setHasReviewed(data.hasReviewed);
        setShowReviewForm(!data.hasReviewed);
      }
    } catch (err) {
      console.error("Error checking review status:", err);
    }
  }, [taskId]);

  const fetchPosterProfile = useCallback(async (posterId: string) => {
    try {
      const response = await fetch(`/api/users/${posterId}/profile-summary`);
      if (response.ok) {
        const data = await response.json();
        setPosterProfile(data);
      }
    } catch (err) {
      console.error("Error fetching poster profile:", err);
    }
  }, []);

  const fetchTask = useCallback(async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) throw new Error("Failed to fetch task");

      const data = await response.json();
      setTask(data);
      setIsOwner(data.isOwner);
      setIsAssigned(data.isAssigned);
      setHasApplied(data.hasApplied);

      // Fetch poster profile
      if (data.createdBy?.id) {
        fetchPosterProfile(data.createdBy.id);
      }

      if (data.isOwner && data.status === "open") {
        fetchApplications();
      }

      if (data.status === "completed" && (data.isOwner || data.isAssigned)) {
        checkReviewStatus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [taskId, fetchApplications, checkReviewStatus, fetchPosterProfile]);

  useEffect(() => {
    if (!taskId) return;
    fetchTask();
  }, [taskId, fetchTask]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: applicationMessage,
          proposedRate: proposedRate ? parseFloat(proposedRate) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      alert("Application submitted successfully!");
      setShowApplicationForm(false);
      fetchTask();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to accept this application?")) return;

    try {
      const response = await fetch(
        `/api/applications/${applicationId}/accept`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to accept application");

      alert("Application accepted! The helper has been assigned to your task.");
      fetchTask();
    } catch {
      alert("Failed to accept application");
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to reject this application?")) return;

    try {
      const response = await fetch(
        `/api/applications/${applicationId}/reject`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to reject application");

      alert("Application rejected.");
      fetchApplications();
    } catch {
      alert("Failed to reject application");
    }
  };

  const handleCompleteTask = async () => {
    if (!confirm("Mark this task as completed?")) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to complete task");

      alert("Task marked as completed! You can now leave a review.");
      fetchTask();
    } catch {
      alert("Failed to complete task");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      alert("Review submitted successfully!");
      setShowReviewForm(false);
      setHasReviewed(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderCategorySpecificData = () => {
    if (!task?.categorySpecificData) return null;

    const data = task.categorySpecificData;

    return (
      <div className="overflow-hidden rounded-md bg-white px-6 py-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{task.category} Details</h2>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium text-gray-700">
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </span>
              <span className="ml-2 text-gray-600">
                {typeof value === "boolean"
                  ? value
                    ? "Yes"
                    : "No"
                  : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

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
          <p className="text-sm text-red-800">{error || "Task not found"}</p>
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

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4">
        <Link
          href="/app/tasks"
          className="text-primary hover:text-primary-hover font-medium text-sm"
        >
          ← Back to tasks
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Task Header */}
          <div className="overflow-hidden rounded-md bg-white px-6 py-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {task.title}
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {task.category}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === "open"
                        ? "bg-green-100 text-green-800"
                        : task.status === "assigned"
                          ? "bg-blue-100 text-blue-800"
                          : task.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
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
                    {task.createdBy.isUvaVerified && (
                      <UvaBadge className="ml-2" />
                    )}
                    {task.createdBy.isBackgroundVerified && (
                      <BgVerifiedBadge className="ml-2" />
                    )}
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
                {task.scheduledDate && (
                  <p className="text-sm text-gray-600 mt-2">
                    Scheduled: {new Date(task.scheduledDate).toLocaleString()}
                  </p>
                )}
                {task.assignedTo && (
                  <p className="text-sm text-gray-600 mt-2 flex items-center gap-1.5">
                    Assigned to: {task.assignedTo.name || task.assignedTo.email}
                    {task.assignedTo.isUvaVerified && (
                      <UvaBadge className="ml-2" />
                    )}
                    {task.assignedTo.isBackgroundVerified && (
                      <BgVerifiedBadge className="ml-2" />
                    )}
                  </p>
                )}
              </div>
              <div className="ml-6 text-right">
                <div className="text-4xl font-bold text-primary">
                  ${task.budget.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">budget</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="overflow-hidden rounded-md bg-white px-6 py-5 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          {/* Category-Specific Data */}
          {renderCategorySpecificData()}

          {/* Location */}
          <div className="overflow-hidden rounded-md bg-white px-6 py-5 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Location</h2>
            <div className="flex items-center gap-2">
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
          </div>

          {/* Application Section (for helpers) */}
          {!isOwner && !isAssigned && task.status === "open" && (
            <div className="overflow-hidden rounded-md bg-white px-6 py-5 shadow-sm">
              {hasApplied ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    Your Application
                  </h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="font-semibold text-blue-900">
                        Application Submitted
                      </p>
                    </div>
                    <p className="text-sm text-blue-800">
                      You have applied to this task. The task poster will review
                      your application and may contact you.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          "Are you sure you want to withdraw your application?"
                        )
                      ) {
                        setSubmitting(true);
                        try {
                          const response = await fetch(
                            `/api/tasks/${taskId}/applications/withdraw`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                            }
                          );
                          if (response.ok) {
                            setHasApplied(false);
                            alert("Application withdrawn successfully");
                            fetchTask();
                          } else {
                            const error = await response.json();
                            alert(
                              error.error || "Failed to withdraw application"
                            );
                          }
                        } catch {
                          alert("Failed to withdraw application");
                        } finally {
                          setSubmitting(false);
                        }
                      }
                    }}
                    disabled={submitting}
                    className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                  >
                    {submitting ? "Withdrawing..." : "Withdraw Application"}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Apply to Help</h2>
                  {!showApplicationForm ? (
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-hover"
                    >
                      Submit Application
                    </button>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Why are you a good fit for this task?
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={applicationMessage}
                          onChange={(e) =>
                            setApplicationMessage(e.target.value)
                          }
                          className="block w-full rounded-md border border-gray-300 px-3 py-2"
                          placeholder="Describe your relevant experience and why you'd be great for this task..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proposed Hourly Rate (Optional)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={proposedRate}
                          onChange={(e) => setProposedRate(e.target.value)}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-hover disabled:opacity-50"
                        >
                          {submitting ? "Submitting..." : "Submit Application"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowApplicationForm(false)}
                          className="px-6 py-2 border border-gray-300 rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          )}

          {/* Applications (for task owners) */}
          {isOwner && task.status === "open" && applications.length > 0 && (
            <div className="overflow-hidden rounded-md bg-white px-6 py-5 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Applications ({applications.length})
              </h2>
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-md border border-gray-100 px-4 py-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link
                          href={`/profile/${app.helper.id}`}
                          className="font-semibold text-lg hover:text-primary"
                        >
                          {app.helper.name || app.helper.email}
                        </Link>
                        {app.helper.averageRating && (
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(Math.round(app.helper.averageRating))}
                            <span className="text-sm text-gray-600">
                              ({app.helper.totalTasksAsHelper} tasks completed)
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {app.proposedRate && (
                          <div className="text-lg font-semibold text-primary">
                            ${app.proposedRate.toFixed(2)}/hr
                          </div>
                        )}
                      </div>
                    </div>
                    {app.helper.bio && (
                      <p className="text-sm text-gray-600 mb-2">
                        {app.helper.bio}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {app.helper.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                      {app.helper.hasCar && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          Has a car
                        </span>
                      )}
                    </div>
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p className="text-sm text-gray-700">{app.message}</p>
                    </div>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptApplication(app.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectApplication(app.id)}
                          className="border border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {app.status !== "pending" && (
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task Actions */}
          {(task.status === "assigned" || task.status === "in_progress") &&
            (isOwner || isAssigned) && (
              <div className="bg-white border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Task Actions</h2>
                <button
                  onClick={handleCompleteTask}
                  className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              </div>
            )}

          {/* Review Form */}
          {task.status === "completed" && showReviewForm && !hasReviewed && (
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${
                            star <= reviewRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-hover disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          {hasReviewed && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-sm text-green-800">
                You have already reviewed this task.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Poster Profile */}
          {posterProfile && (
            <div className="overflow-hidden rounded-md bg-white px-6 py-5 shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Posted by
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-uva-orange text-lg font-semibold text-white">
                  {(posterProfile.name || posterProfile.email)
                    .slice(0, 1)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {posterProfile.name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {posterProfile.isUvaVerified && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                        UVA Verified
                      </span>
                    )}
                    {posterProfile.isBackgroundVerified && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        Background Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {posterProfile.bio && (
                <p className="text-sm text-gray-600 mb-4">
                  {posterProfile.bio}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4 text-center border-t border-gray-100 pt-4">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {posterProfile.totalTasksPosted}
                  </p>
                  <p className="text-xs text-gray-500">Tasks Posted</p>
                </div>
                {posterProfile.averageRating && (
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {posterProfile.averageRating.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">Avg Rating</p>
                  </div>
                )}
              </div>

              {/* Recent Completed Tasks */}
              {posterProfile.recentCompletedTasks.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Recent Tasks
                  </h3>
                  <div className="space-y-2">
                    {posterProfile.recentCompletedTasks.map((task) => (
                      <Link
                        key={task.id}
                        href={`/app/tasks/${task.id}`}
                        className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            {task.category}
                          </span>
                          <span className="text-xs font-medium text-primary">
                            ${task.budget.toFixed(2)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Reviews */}
              {posterProfile.recentReviews.length > 0 && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Recent Reviews
                  </h3>
                  <div className="space-y-3">
                    {posterProfile.recentReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {renderStars(review.rating)}
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600 mb-1">
                            &ldquo;{review.comment}&rdquo;
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          by {review.reviewer.name || review.reviewer.email}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
