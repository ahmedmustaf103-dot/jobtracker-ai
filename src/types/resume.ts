export type ResumeKeywordAnalysis = {
  present: string[];
  missing: string[];
  recommended: string[];
};

export type ResumeAnalysisPayload = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  atsSuggestions: string[];
  improvements: string[];
  keywords: ResumeKeywordAnalysis;
};

export type ResumeAnalysisRecord = ResumeAnalysisPayload & {
  id: string;
  resumeId: string;
  fileName: string;
  extractedText?: string;
  createdAt: string;
};
