/**
 * SerpAPI Background Check Service
 * Uses SerpAPI to perform background verification searches
 */

interface BackgroundCheckResult {
  success: boolean;
  data?: {
    searchResults: any[];
    newsResults: any[];
    summary: string;
  };
  error?: string;
}

/**
 * Performs a background check using SerpAPI
 * @param fullName - User's full name
 * @param location - Optional location for more targeted search
 * @returns Background check results
 */
export async function performBackgroundCheck(
  fullName: string,
  location?: string
): Promise<BackgroundCheckResult> {
  const apiKey = process.env.SERPAPI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "SerpAPI key not configured",
    };
  }

  try {
    // Build search query
    const locationQuery = location ? ` ${location}` : "";
    const searchQuery = `"${fullName}"${locationQuery} background`;

    // Perform Google search via SerpAPI
    const searchUrl = new URL("https://serpapi.com/search");
    searchUrl.searchParams.append("engine", "google");
    searchUrl.searchParams.append("q", searchQuery);
    searchUrl.searchParams.append("api_key", apiKey);
    searchUrl.searchParams.append("num", "10");

    const searchResponse = await fetch(searchUrl.toString());

    if (!searchResponse.ok) {
      throw new Error(`SerpAPI request failed: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();

    // Also search Google News for any news articles
    const newsUrl = new URL("https://serpapi.com/search");
    newsUrl.searchParams.append("engine", "google_news");
    newsUrl.searchParams.append("q", `"${fullName}"`);
    newsUrl.searchParams.append("api_key", apiKey);

    const newsResponse = await fetch(newsUrl.toString());
    const newsData = newsResponse.ok ? await newsResponse.json() : null;

    // Extract relevant information
    const organicResults = searchData.organic_results || [];
    const newsResults = newsData?.news_results || [];

    // Generate a summary
    const resultCount = organicResults.length + newsResults.length;
    const summary = generateSummary(fullName, resultCount, organicResults, newsResults);

    return {
      success: true,
      data: {
        searchResults: organicResults.slice(0, 5), // Limit stored results
        newsResults: newsResults.slice(0, 5),
        summary,
      },
    };
  } catch (error) {
    console.error("Background check error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Generates a human-readable summary of the background check
 */
function generateSummary(
  fullName: string,
  resultCount: number,
  searchResults: any[],
  newsResults: any[]
): string {
  if (resultCount === 0) {
    return `No significant online presence found for ${fullName}.`;
  }

  const parts: string[] = [];

  if (searchResults.length > 0) {
    parts.push(`${searchResults.length} general search result(s)`);
  }

  if (newsResults.length > 0) {
    parts.push(`${newsResults.length} news article(s)`);
  }

  return `Background check completed. Found ${parts.join(" and ")} for ${fullName}.`;
}

/**
 * Validates if a user profile is complete enough for verification
 */
export function isProfileCompleteForVerification(user: {
  name: string | null;
  bio: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  email: string;
}): { valid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  if (!user.name || user.name.trim().length < 3) {
    missingFields.push("Full name (minimum 3 characters)");
  }

  if (!user.bio || user.bio.trim().length < 20) {
    missingFields.push("Bio (minimum 20 characters)");
  }

  if (!user.addressLine1 || !user.city || !user.state || !user.zipCode) {
    missingFields.push("Complete address (street, city, state, ZIP code)");
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
