"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: {
    name: string | null;
    email: string;
  };
  task: {
    title: string;
  };
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  skills: string[];
  hasCar: boolean;
  hourlyRate: number | null;
  averageRating: number | null;
  totalTasksAsHelper: number;
  isHelperProfileComplete: boolean;
  createdAt: string;
  reviewsReceived: Review[];
}

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params?.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/profile`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-sm text-red-800">{error || "Profile not found"}</p>
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/app/tasks"
          className="text-primary hover:text-primary-hover font-medium text-sm"
        >
          ← Back to tasks
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white border rounded-lg p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-semibold text-gray-600 flex-shrink-0">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : profile.email.charAt(0).toUpperCase()}
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.name || "Helper"}
            </h1>

            {/* Rating */}
            {profile.averageRating && (
              <div className="flex items-center gap-2 mb-3">
                {renderStars(Math.round(profile.averageRating))}
                <span className="text-sm text-gray-600">
                  {profile.averageRating.toFixed(1)} ({profile.reviewsReceived.length}{" "}
                  {profile.reviewsReceived.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {profile.totalTasksAsHelper} task
                {profile.totalTasksAsHelper !== 1 ? "s" : ""} completed
              </div>
              {profile.hasCar && (
                <div className="flex items-center gap-1">
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
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                  Has a car
                </div>
              )}
            </div>

            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Hourly Rate */}
            {profile.hourlyRate && (
              <div className="mt-4 text-lg font-semibold text-gray-900">
                ${profile.hourlyRate.toFixed(2)}/hour
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}
      </div>

      {/* Reviews */}
      {profile.reviewsReceived.length > 0 && (
        <div className="bg-white border rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6">
            Reviews ({profile.reviewsReceived.length})
          </h2>
          <div className="space-y-6">
            {profile.reviewsReceived.map((review) => (
              <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.reviewer.name || review.reviewer.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      Task: {review.task.title}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mb-2">{renderStars(review.rating)}</div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!profile.isHelperProfileComplete && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
          <p className="text-sm text-yellow-800">
            This user hasn&apos;t completed their helper profile yet.
          </p>
        </div>
      )}
    </div>
  );
}
