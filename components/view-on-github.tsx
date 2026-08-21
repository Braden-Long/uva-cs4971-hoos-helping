/**
 * Hoos Helping is a portfolio project rather than a live product, so the
 * public pages carry a link back to the repository. The goal is for someone
 * reading a resume to reach the commit history in one click.
 */
export const GITHUB_REPO_URL =
  "https://github.com/Braden-Long/uva-cs4971-hoos-helping";

const LINK_LABEL =
  "View the Hoos Helping source code and commit history on GitHub (opens in a new tab)";

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

/**
 * Full-width bar that sits in normal document flow at the very top of a page,
 * so it never overlaps the design underneath it. Fixed 2.5rem height: pages
 * that overlay an absolutely positioned header offset it by `top-10` to match.
 */
export function ViewOnGitHubBanner() {
  return (
    <div className="relative z-50 bg-[#0d1117]">
      <a
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={LINK_LABEL}
        className="group mx-auto flex h-10 max-w-7xl items-center justify-center gap-x-2 px-6 text-xs transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-uva-orange sm:text-sm lg:px-8"
      >
        <GitHubMark className="size-4 shrink-0 text-white" />
        <span className="hidden text-gray-400 sm:inline">
          Portfolio project
          <span aria-hidden="true" className="mx-2 text-gray-600">
            ·
          </span>
        </span>
        <span className="font-semibold text-white decoration-uva-orange decoration-2 underline-offset-4 group-hover:underline">
          <span className="sm:hidden">View on GitHub</span>
          <span className="hidden sm:inline">
            View the source &amp; commit history on GitHub
          </span>
        </span>
        <span
          aria-hidden="true"
          className="text-uva-orange transition-transform group-hover:translate-x-0.5"
        >
          &rarr;
        </span>
      </a>
    </div>
  );
}

/**
 * Inline variant for footers and secondary navigation, where a full-width bar
 * would be too loud.
 */
export function ViewOnGitHubLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={LINK_LABEL}
      className={`inline-flex items-center gap-1.5 transition-colors ${className}`}
    >
      <GitHubMark className="size-4 shrink-0" />
      <span>View on GitHub</span>
    </a>
  );
}
