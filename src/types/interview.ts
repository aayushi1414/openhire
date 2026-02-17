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
  interviewerId: bigint;
  objective: string;
  questionCount: number;
  timeDuration: string;
  isAnonymous: boolean;
  questions: Question[];
  description: string;
  responseCount: bigint;
}

export interface InterviewDetails {
  id: string;
  createdAt: Date;
  insights: string[];
  quotes: Quote[];
  details: any;
  isActive: boolean;
  themeColor: string;
  logoUrl: string;
  respondents: string[];
  readableSlug: string;
}

export interface Interview extends InterviewBase, InterviewDetails {}
