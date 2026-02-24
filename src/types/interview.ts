export interface Question {
  id: string;
  question: string;
  followUpCount: number;
}

export interface Quote {
  quote: string;
  callId: string;
}

export interface InterviewBase {
  userId: string;
  name: string;
  interviewerId: number;
  objective: string;
  questionCount: number;
  timeDuration: string;
  isAnonymous: boolean;
  questions: Question[];
  description: string;
  responseCount: number;
}

export interface InterviewDetails {
  id: string;
  createdAt: Date;
  quotes: Quote[];
  details: Record<string, unknown> | null;
  isActive: boolean;
  logoUrl: string;
  respondents: string[];
  readableSlug: string;
}

export interface Interview extends InterviewBase, InterviewDetails {}
