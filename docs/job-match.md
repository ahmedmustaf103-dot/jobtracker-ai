# AI Job Match

On-demand scoring of how well your **latest uploaded resume** fits a specific job application.

## What it does

From an application detail page you can paste (or reuse) a job description and get:

- Overall match score (0–100%)
- Recommendation band (strong / good / partial / weak)
- Matching skills evidenced in the resume
- Gaps phrased as **not mentioned / limited evidence** (never invented experience)
- Experience notes, strengths, summary, and scoring notes

Scores are **not persisted** — each run recomputes from current resume + JD text.

## Data used

| Input | Source |
|-------|--------|
| Resume | Latest `Resume.extractedText` for the signed-in user |
| Job description | Paste (required if nothing else) → long application `notes` → matching cover-letter JD (`company` + `role`) |
| Context | Application `company` + `title` |

No new database tables. Application rows still do not store a dedicated `jobDescription` field.

## Scoring model

Approximate weights (also enforced in the Gemini system prompt):

| Factor | Weight |
|--------|--------|
| Required / core skills | 45% |
| Preferred skills | 20% |
| Experience alignment | 20% |
| Role / responsibility fit | 15% |

**Bands:** Strong ≥80 · Good 65–79 · Partial 45–64 · Weak &lt;45  

The UI always maps `recommendation` from the numeric score so bands stay consistent even if the model drifts.

## AI rules

- Only use skills/experience clearly present in the resume text.
- Prefer “not mentioned in resume” over claiming the candidate lacks a skill.
- Prioritize required qualifications over nice-to-haves.
- Output is Gemini JSON (`responseMimeType: application/json`) then **Zod-validated** (`jobMatchResultSchema`). Invalid or out-of-range scores are rejected.

## Limitations

- Quality depends on resume extract quality and JD completeness.
- Cover-letter JD matching is heuristic (same company/role strings), not a foreign key.
- Job posting URLs are not scraped.
- Matching is advisory — not a guarantee of interview outcomes.
