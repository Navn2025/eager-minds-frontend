// ---- User & Auth ----
export type UserRole = "admin" | "standard" | "premium";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  membershipStatus: "standard" | "upgraded";
  createdAt: string;
}

// ---- 11+ Prep ----
export type Subject =
  | "maths"
  | "english"
  | "verbal-reasoning"
  | "non-verbal-reasoning";

export interface Worksheet {
  id: string;
  title: string;
  subject: Subject;
  topic: string;
  fileUrl: string;
  answersFileUrl?: string;
  createdAt: string;
}

export interface WordOfTheDay {
  id: string;
  word: string;
  meaning: string;
  synonym: string;
  antonym: string;
  exampleSentence: string;
  pronunciation: string;
  date: string;
}

// ---- Competitions ----
export interface Competition {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "upcoming" | "past";
  registrationLink?: string;
  rules?: string;
  winners?: string[];
  galleryImages?: string[];
}

// ---- Arts & Craft ----
export interface ArtsCraftProject {
  id: string;
  title: string;
  description: string;
  steps?: string[];
  images?: string[];
  videoUrl?: string;
  createdAt: string;
}

// ---- Activities ----
export interface Activity {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  worksheetUrl?: string;
  date?: string;
}

// ---- What's On (Events) ----
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  bookingLink?: string;
}

// ---- Blog ----
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  publishedAt?: string;
  scheduledAt?: string;
  status: "draft" | "published" | "scheduled";
  createdAt: string;
}

// ---- Magazines ----
export interface Magazine {
  id: string;
  title: string;
  month: number;
  year: number;
  coverImageUrl: string;
  fileUrl: string;
  createdAt: string;
}

// ---- 11+ Papers on Demand ----
export interface Paper {
  id: string;
  title: string;
  subject: Subject;
  difficulty: "easy" | "medium" | "hard";
  category: "past-paper" | "mock-paper" | "worksheet";
  fileUrl: string;
  isPremium: boolean;
  createdAt: string;
}

// ---- Progress Tracking ----
export interface UserProgress {
  userId: string;
  itemId: string;
  itemType: "worksheet" | "paper" | "activity";
  completed: boolean;
  completedAt?: string;
}

// ---- Testimonials ----
export interface Testimonial {
  id: string;
  parentName: string;
  content: string;
  rating?: number;
  createdAt: string;
}

// ---- FAQs ----
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "membership" | "pricing" | "timings" | "technical" | "resources";
}

// ---- Enquiry ----
export interface Enquiry {
  id: string;
  parentName: string;
  email: string;
  message: string;
  createdAt: string;
}

// ---- Team Member ----
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
}
