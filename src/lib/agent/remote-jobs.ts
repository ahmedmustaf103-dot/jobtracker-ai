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
};

type RemotiveResponse = {
  jobs?: RemotiveJob[];
};

export async function searchRemoteJobs(
  query: string,
  limit = 5,
): Promise<RemoteJob[]> {
  const url = new URL("https://remotive.com/api/remote-jobs");
  url.searchParams.set("search", query);
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 10)));

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Job board request failed (${response.status}).`);
  }

  const data = (await response.json()) as RemotiveResponse;
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];

  return jobs.slice(0, limit).map((job) => ({
    id: job.id,
    title: job.title?.trim() || "Untitled role",
    company: job.company_name?.trim() || "Unknown company",
    location: job.candidate_required_location?.trim() || "Remote",
    url: job.url?.trim() || `https://remotive.com/remote-jobs/${job.id}`,
    salary: job.salary?.trim() || null,
    category: job.category?.trim() || "General",
    tags: Array.isArray(job.tags) ? job.tags.slice(0, 8) : [],
    publicationDate: job.publication_date ?? null,
  }));
}
