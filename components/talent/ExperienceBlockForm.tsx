"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Input, Button, Card } from "@/components/ui";
import { Text } from "@/components/ui/Typography";
import {
  createExperienceBlock,
  updateExperienceBlock,
} from "@/app/actions/experience-blocks";
import { EXPERIENCE_BLOCK_OPTIONS } from "@/data/mcs/blocks";
import { ROLE_LEVEL_OPTIONS } from "@/data/mcs/roles";
import { STORE_TIER_OPTIONS } from "@/data/mcs/tiers";
import { DIVISION_OPTIONS } from "@/data/mcs/divisions";
import { BRAND_SEGMENTS } from "@/data/mcs";
import type { ExperienceBlock } from "@/lib/supabase/database.types";

interface ExperienceBlockFormProps {
  block?: ExperienceBlock;
  mode: "create" | "edit";
}

export function ExperienceBlockForm({ block, mode }: ExperienceBlockFormProps) {
  // Form state
  const [isCurrent, setIsCurrent] = useState(block?.is_current ?? false);
  const [achievements, setAchievements] = useState<string[]>(
    block?.achievements || []
  );
  const [newAchievement, setNewAchievement] = useState("");

  // Create bound action for update
  const boundUpdateAction = block
    ? updateExperienceBlock.bind(null, block.id)
    : createExperienceBlock;

  const [state, formAction, isPending] = useActionState(
    mode === "edit" ? boundUpdateAction : createExperienceBlock,
    null
  );

  // Format date for input
  const formatDateForInput = (dateStr: string | null): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  // Add achievement
  const handleAddAchievement = () => {
    if (newAchievement.trim() && achievements.length < 5) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  // Remove achievement
  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  // Handle Enter key in achievement input
  const handleAchievementKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAchievement();
    }
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* Error Message */}
      {state?.error && (
        <Card variant="default" className="bg-error/5 border-error">
          <Text variant="body" className="text-error">
            {state.error}
          </Text>
        </Card>
      )}

      {/* Block Type */}
      <div>
        <label
          htmlFor="blockType"
          className="block text-label font-medium text-charcoal"
        >
          Experience Type <span className="text-error">*</span>
        </label>
        <select
          id="blockType"
          name="blockType"
          required
          defaultValue={block?.block_type || ""}
          className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
        >
          <option value="">Select type...</option>
          {EXPERIENCE_BLOCK_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
      </div>

      {/* Two-column grid for desktop */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <Input
          name="title"
          label="Job Title"
          required
          defaultValue={block?.title || ""}
          placeholder="e.g., Senior Sales Advisor"
        />

        {/* Company */}
        <Input
          name="company"
          label="Maison / Company"
          required
          defaultValue={block?.company || ""}
          placeholder="e.g., Chanel"
        />

        {/* Location */}
        <Input
          name="location"
          label="Location"
          defaultValue={block?.location || ""}
          placeholder="e.g., Paris, France"
        />

        {/* Brand Segment */}
        <div>
          <label
            htmlFor="brandSegment"
            className="block text-label font-medium text-charcoal"
          >
            Brand Segment
          </label>
          <select
            id="brandSegment"
            name="brandSegment"
            defaultValue={block?.brand_segment || ""}
            className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
          >
            <option value="">Select segment...</option>
            {BRAND_SEGMENTS.map((segment) => (
              <option key={segment.value} value={segment.value}>
                {segment.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Section */}
      <div className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-label font-medium text-charcoal"
            >
              Start Date <span className="text-error">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              defaultValue={formatDateForInput(block?.start_date || null)}
              max={new Date().toISOString().split("T")[0]}
              className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
            />
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-label font-medium text-charcoal"
            >
              End Date {!isCurrent && <span className="text-error">*</span>}
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              disabled={isCurrent}
              required={!isCurrent}
              defaultValue={formatDateForInput(block?.end_date || null)}
              className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold disabled:cursor-not-allowed disabled:bg-concrete/30 disabled:text-soft-grey"
            />
          </div>
        </div>

        {/* Current Position Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isCurrent"
            name="isCurrent"
            value="true"
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
            className="h-5 w-5 rounded border-concrete text-matte-gold focus:ring-matte-gold"
          />
          <label htmlFor="isCurrent" className="text-body text-charcoal">
            I currently work here
          </label>
        </div>
      </div>

      {/* Role Level and Store Tier */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Role Level */}
        <div>
          <label
            htmlFor="roleLevel"
            className="block text-label font-medium text-charcoal"
          >
            Role Level
          </label>
          <select
            id="roleLevel"
            name="roleLevel"
            defaultValue={block?.store_tier || ""}
            className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
          >
            <option value="">Select level...</option>
            {ROLE_LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Text variant="caption" className="mt-1 text-soft-grey">
            L1 (Sales Advisor) to L8 (Regional Director)
          </Text>
        </div>

        {/* Store Tier */}
        <div>
          <label
            htmlFor="storeTier"
            className="block text-label font-medium text-charcoal"
          >
            Store Tier
          </label>
          <select
            id="storeTier"
            name="storeTier"
            defaultValue={block?.store_tier || ""}
            className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
          >
            <option value="">Select tier...</option>
            {STORE_TIER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Text variant="caption" className="mt-1 text-soft-grey">
            T1 (Flagship) to T5 (Outlet/Travel Retail)
          </Text>
        </div>
      </div>

      {/* Division */}
      <div>
        <label
          htmlFor="division"
          className="block text-label font-medium text-charcoal"
        >
          Primary Division
        </label>
        <select
          id="division"
          name="division"
          defaultValue={block?.division || ""}
          className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
        >
          <option value="">Select division...</option>
          {DIVISION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-label font-medium text-charcoal"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          defaultValue={
            block?.responsibilities?.join("\n") || ""
          }
          placeholder="Describe your responsibilities and key activities..."
          className="mt-2 block w-full rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal placeholder:text-soft-grey focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
        />
        <Text variant="caption" className="mt-1 text-soft-grey">
          Maximum 500 characters
        </Text>
      </div>

      {/* Achievements */}
      <div>
        <label className="block text-label font-medium text-charcoal">
          Key Achievements
        </label>
        <Text variant="caption" className="mt-1 text-soft-grey">
          Add up to 5 key achievements in this role
        </Text>

        {/* Achievement List */}
        {achievements.length > 0 && (
          <ul className="mt-4 space-y-2">
            {achievements.map((achievement, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded border border-concrete bg-white p-3"
              >
                <span className="text-matte-gold">•</span>
                <Text variant="body" className="flex-1 text-charcoal">
                  {achievement}
                </Text>
                <button
                  type="button"
                  onClick={() => handleRemoveAchievement(index)}
                  className="text-soft-grey hover:text-error transition-colors"
                  aria-label={`Remove achievement: ${achievement}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Achievement Input */}
        {achievements.length < 5 && (
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              onKeyDown={handleAchievementKeyDown}
              placeholder="e.g., Exceeded sales targets by 30%"
              className="flex-1 rounded border border-concrete bg-white px-4 py-3 text-body text-charcoal placeholder:text-soft-grey focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddAchievement}
              disabled={!newAchievement.trim()}
            >
              Add
            </Button>
          </div>
        )}

        {/* Hidden input to send achievements */}
        <input
          type="hidden"
          name="achievements"
          value={JSON.stringify(achievements)}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 border-t border-concrete pt-6">
        <Link href="/talent/profile/experience">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
        <Button type="submit" variant="primary" loading={isPending}>
          {mode === "create" ? "Add Experience" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
