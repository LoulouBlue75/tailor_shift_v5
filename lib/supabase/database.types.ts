/**
 * Tailor Shift V5 - Database Types
 * Auto-generated type definitions for Supabase tables
 */

// ============================================================================
// ENUMS
// ============================================================================

export type UserType = "talent" | "brand";

export type RoleLevel = "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7" | "L8";

export type StoreTier = "T1" | "T2" | "T3" | "T4" | "T5";

export type Division =
  | "fashion"
  | "leather_goods"
  | "shoes"
  | "beauty"
  | "fragrance"
  | "watches"
  | "high_jewelry"
  | "eyewear"
  | "accessories";

export type BrandSegment =
  | "ultra_luxury"
  | "luxury"
  | "premium"
  | "accessible_luxury";

export type ExperienceBlockType =
  | "foh"
  | "boh"
  | "leadership"
  | "clienteling"
  | "operations"
  | "business";

export type Region = "EMEA" | "Americas" | "APAC" | "Middle_East";

export type Mobility = "local" | "regional" | "national" | "international";

export type Timeline = "active" | "passive" | "not_looking";

export type OpportunityStatus =
  | "draft"
  | "active"
  | "paused"
  | "filled"
  | "cancelled";

export type MatchStatus =
  | "pending"
  | "talent_interested"
  | "brand_interested"
  | "mutual_interest"
  | "declined"
  | "expired";

export type AssessmentStatus = "in_progress" | "completed" | "expired";

export type LearningCategory =
  | "service_excellence"
  | "clienteling"
  | "operations"
  | "leadership"
  | "product_knowledge";

export type ContentType = "video" | "article" | "exercise" | "quiz";

export type Difficulty = "beginner" | "intermediate" | "advanced";

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface Profile {
  id: string;
  user_type: UserType;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Talent {
  id: string;
  profile_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  linkedin_url: string | null;
  current_role_level: RoleLevel | null;
  current_store_tier: StoreTier | null;
  years_in_luxury: number | null;
  current_maison: string | null;
  current_location: string | null;
  divisions_expertise: Division[];
  career_preferences: CareerPreferences;
  compensation_profile: CompensationProfile;
  assessment_summary: AssessmentSummary;
  profile_completion_pct: number;
  created_at: string;
  updated_at: string;
}

export interface CareerPreferences {
  target_role_levels: RoleLevel[];
  target_store_tiers: StoreTier[];
  target_divisions: Division[];
  target_locations: string[];
  mobility: Mobility;
  timeline: Timeline;
}

export interface CompensationProfile {
  current_base: number | null;
  current_variable: number | null;
  currency: string;
  expectations: number | null;
}

export interface AssessmentSummary {
  service_excellence: number | null;
  clienteling: number | null;
  operations: number | null;
  leadership_signals: number | null;
  version: string | null;
  completed_at: string | null;
}

export interface ExperienceBlock {
  id: string;
  talent_id: string;
  block_type: ExperienceBlockType;
  title: string;
  company: string;
  brand_segment: BrandSegment | null;
  division: Division | null;
  store_tier: StoreTier | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  responsibilities: string[] | null;
  achievements: string[] | null;
  skills_demonstrated: string[] | null;
  team_size: number | null;
  verified: boolean;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  talent_id: string;
  version: string;
  service_excellence_score: number | null;
  clienteling_score: number | null;
  operations_score: number | null;
  leadership_score: number | null;
  responses: Record<string, unknown> | null;
  status: AssessmentStatus;
  started_at: string;
  completed_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  profile_id: string;
  name: string;
  segment: BrandSegment | null;
  parent_group: string | null;
  primary_division: Division | null;
  divisions: Division[];
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  headquarters_location: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  brand_id: string;
  name: string;
  tier: StoreTier;
  address: string | null;
  city: string;
  country: string;
  region: Region | null;
  store_size_sqm: number | null;
  team_size: number | null;
  divisions: Division[];
  status: "active" | "opening_soon" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  brand_id: string;
  store_id: string | null;
  title: string;
  role_level: RoleLevel;
  division: Division | null;
  required_experience_years: number | null;
  required_languages: string[];
  required_skills: string[];
  description: string | null;
  responsibilities: string[] | null;
  benefits: string[] | null;
  compensation_range: CompensationRange;
  matching_criteria: MatchingCriteria;
  status: OpportunityStatus;
  published_at: string | null;
  deadline_at: string | null;
  filled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompensationRange {
  min_base: number | null;
  max_base: number | null;
  variable_pct: number | null;
  currency: string;
}

export interface MatchingCriteria {
  min_assessment_scores: Partial<AssessmentSummary>;
  preferred_maisons: string[];
  preferred_divisions: Division[];
  weight_overrides: Record<string, number>;
}

export interface Match {
  id: string;
  talent_id: string;
  opportunity_id: string;
  score: number;
  score_breakdown: ScoreBreakdown;
  status: MatchStatus;
  talent_action: "interested" | "declined" | null;
  talent_action_at: string | null;
  brand_action: "interested" | "declined" | null;
  brand_action_at: string | null;
  brand_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScoreBreakdown {
  role_fit: number;
  experience_fit: number;
  division_fit: number;
  location_fit: number;
  assessment_fit: number;
  culture_fit: number;
  timing_fit: number;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string | null;
  category: LearningCategory;
  content_type: ContentType;
  content_url: string | null;
  duration_minutes: number | null;
  target_role_levels: RoleLevel[];
  target_divisions: Division[];
  difficulty: Difficulty;
  status: "draft" | "active" | "archived";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TalentLearningProgress {
  id: string;
  talent_id: string;
  module_id: string;
  status: "not_started" | "in_progress" | "completed";
  progress_pct: number;
  quiz_score: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// DATABASE SCHEMA TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      talents: {
        Row: Talent;
        Insert: Omit<Talent, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Talent, "id" | "profile_id" | "created_at">>;
      };
      experience_blocks: {
        Row: ExperienceBlock;
        Insert: Omit<ExperienceBlock, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ExperienceBlock, "id" | "talent_id" | "created_at">>;
      };
      assessments: {
        Row: Assessment;
        Insert: Omit<Assessment, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Assessment, "id" | "talent_id" | "created_at">>;
      };
      brands: {
        Row: Brand;
        Insert: Omit<Brand, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Brand, "id" | "profile_id" | "created_at">>;
      };
      stores: {
        Row: Store;
        Insert: Omit<Store, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Store, "id" | "brand_id" | "created_at">>;
      };
      opportunities: {
        Row: Opportunity;
        Insert: Omit<Opportunity, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Opportunity, "id" | "brand_id" | "created_at">>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Match, "id" | "talent_id" | "opportunity_id" | "created_at">>;
      };
      learning_modules: {
        Row: LearningModule;
        Insert: Omit<LearningModule, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<LearningModule, "id" | "created_at">>;
      };
      talent_learning_progress: {
        Row: TalentLearningProgress;
        Insert: Omit<TalentLearningProgress, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TalentLearningProgress, "id" | "talent_id" | "module_id" | "created_at">>;
      };
    };
  };
}
