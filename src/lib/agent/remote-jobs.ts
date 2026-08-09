export type RemoteJob = {
  id: number;
  title: string;
  company: string;
  location: string;
  url: string;
  salary: string | null;
  category: string;
  tags: string[];
  publicationDate: string | null;
  excerpt?: string;
};

export type RemoteJobSearchResult = {
  jobs: RemoteJob[];
  source: "jobicy" | "remotive";
};

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "find",
  "job",
  "jobs",
  "looking",
  "open",
  "or",
  "position",
  "positions",
  "remote",
  "role",
  "roles",
  "search",
  "the",
  "with",
]);

type JobicyJob = {
  id?: number;
  url?: string;
  jobTitle?: string;
  companyName?: string;
  jobGeo?: string;
  jobIndustry?: string[];
  jobExcerpt?: string;
  jobType?: string[];
  jobLevel?: string;
};

type RemotiveJob = {
  id: number;
  title?: string;
  company_name?: string;
  candidate_required_location?: string;
  url?: string;
  salary?: string;
  category?: string;
  tags?: string[];
  publication_date?: string;
  description?: string;
};

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Score how well a job matches query tokens. Title/tag hits rank highest. */
export function scoreRemoteJob(
  job: Pick<RemoteJob, "title" | "company" | "category" | "tags" | "excerpt">,
  tokens: string[],
): number {
  if (tokens.length === 0) return 1;

  const title = job.title.toLowerCase();
  const tags = job.tags.map((t) => t.toLowerCase());
  const haystack = [
    title,
    job.company.toLowerCase(),
    job.category.toLowerCase(),
    tags.join(" "),
    (job.excerpt ?? "").toLowerCase(),
  ].join(" ");

  let score = 0;

  for (const token of tokens) {
    const word = new RegExp(`\\b${escapeRegExp(token)}\\b`, "i");
    if (word.test(title)) {
      score += 6;
      continue;
    }
    if (tags.some((tag) => tag === token || word.test(tag))) {
      score += 4;
      continue;
    }
    if (word.test(haystack)) {
      score += 2;
    }
  }

  return score;
}

function rankJobs(jobs: RemoteJob[], query: string, limit: number): RemoteJob[] {
  const tokens = tokenize(query);
  const ranked = jobs
    .map((job) => ({ job, score: scoreRemoteJob(job, tokens) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit).map((row) => row.job);
}

function primaryTag(query: string): string {
  const tokens = tokenize(query);
  return tokens[0] || "software";
}

async function searchJobicy(query: string, limit: number): Promise<RemoteJob[]> {
  const tag = primaryTag(query);
  const url = new URL("https://jobicy.com/api/v2/remote-jobs");
  url.searchParams.set("count", String(Math.min(Math.max(limit * 3, 10), 50)));
  url.searchParams.set("tag", tag);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Jobicy request failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    jobs?: JobicyJob[];
    success?: boolean;
    error?: string;
  };

  if (data.success === false) {
    throw new Error(data.error || "Jobicy search failed.");
  }

  const jobs = (Array.isArray(data.jobs) ? data.jobs : []).map((job) => ({
    id: job.id ?? 0,
    title: job.jobTitle?.trim() || "Untitled role",
    company: job.companyName?.trim() || "Unknown company",
    location: job.jobGeo?.trim() || "Remote",
    url: job.url?.trim() || "https://jobicy.com",
    salary: null,
    category: job.jobIndustry?.[0]?.trim() || "General",
    tags: [
      ...(job.jobType ?? []),
      ...(job.jobLevel ? [job.jobLevel] : []),
      tag,
    ].filter(Boolean),
    publicationDate: null,
    excerpt: job.jobExcerpt?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  }));

  return rankJobs(jobs, query, limit);
}

async function searchRemotiveFallback(
  query: string,
  limit: number,
): Promise<RemoteJob[]> {
  const url = new URL("https://remotive.com/api/remote-jobs");
  // Remotive's public `search` param is currently ignored; fetch feed + filter locally.
  url.searchParams.set("category", "software-dev");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Remotive request failed (${response.status}).`);
  }

  const data = (await response.json()) as { jobs?: RemotiveJob[] };
  const jobs = (Array.isArray(data.jobs) ? data.jobs : []).map((job) => ({
    id: job.id,
    title: job.title?.trim() || "Untitled role",
    company: job.company_name?.trim() || "Unknown company",
    location: job.candidate_required_location?.trim() || "Remote",
    url: job.url?.trim() || `https://remotive.com/remote-jobs/${job.id}`,
    salary: job.salary?.trim() || null,
    category: job.category?.trim() || "General",
    tags: Array.isArray(job.tags) ? job.tags.slice(0, 8) : [],
    publicationDate: job.publication_date ?? null,
    excerpt: job.description
      ?.replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 280),
  }));

  return rankJobs(jobs, query, limit);
}

export async function searchRemoteJobs(
  query: string,
  limit = 5,
): Promise<RemoteJobSearchResult> {
  const capped = Math.min(Math.max(limit, 1), 10);

  try {
    const jobs = await searchJobicy(query, capped);
    if (jobs.length > 0) {
      return { jobs, source: "jobicy" };
    }
  } catch {
    // Fall through to Remotive.
  }

  const jobs = await searchRemotiveFallback(query, capped);
  return { jobs, source: "remotive" };
}
