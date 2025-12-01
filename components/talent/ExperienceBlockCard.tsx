"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { Text } from "@/components/ui/Typography";
import { deleteExperienceBlock } from "@/app/actions/experience-blocks";
import { EXPERIENCE_BLOCKS } from "@/data/mcs/blocks";
import { ROLE_LEVELS } from "@/data/mcs/roles";
import { STORE_TIERS } from "@/data/mcs/tiers";
import { DIVISIONS } from "@/data/mcs/divisions";
import type { ExperienceBlock } from "@/lib/supabase/database.types";

interface ExperienceBlockCardProps {
  block: ExperienceBlock;
}

function formatDateRange(startDate: string, endDate: string | null, isCurrent: boolean): string {
  const start = new Date(startDate);
  const startFormatted = start.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  if (isCurrent) {
    return `${startFormatted} - Present`;
  }

  if (endDate) {
    const end = new Date(endDate);
    const endFormatted = end.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return `${startFormatted} - ${endFormatted}`;
  }

  return startFormatted;
}

function getBlockTypeVariant(blockType: string): "default" | "success" | "warning" | "error" | "info" {
  const variants: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
    foh: "info",
    boh: "default",
    leadership: "success",
    clienteling: "warning",
    operations: "default",
    business: "info",
  };
  return variants[blockType] || "default";
}

export function ExperienceBlockCard({ block }: ExperienceBlockCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const blockTypeInfo = EXPERIENCE_BLOCKS[block.block_type as keyof typeof EXPERIENCE_BLOCKS];
  const roleLevelInfo = block.store_tier ? ROLE_LEVELS[block.store_tier as keyof typeof ROLE_LEVELS] : null;
  const storeTierInfo = block.store_tier ? STORE_TIERS[block.store_tier as keyof typeof STORE_TIERS] : null;
  const divisionInfo = block.division ? DIVISIONS[block.division as keyof typeof DIVISIONS] : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteExperienceBlock(block.id);
    if (result?.error) {
      alert(result.error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
    // If successful, the page will be revalidated
  };

  return (
    <>
      <Card variant="default" className="relative">
        {/* Header with block type and actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant={getBlockTypeVariant(block.block_type)} size="sm">
              {blockTypeInfo?.name || block.block_type.toUpperCase()}
            </Badge>
            <h3 className="font-sans text-lg font-semibold text-charcoal">
              {block.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/talent/profile/experience/${block.id}/edit`}>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-error hover:text-error"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Company and Location */}
        <div className="mt-2">
          <Text variant="body" className="text-charcoal">
            {block.company}
            {block.location && (
              <span className="text-soft-grey"> • {block.location}</span>
            )}
          </Text>
        </div>

        {/* Date Range */}
        <Text variant="caption" className="mt-1 text-soft-grey">
          {formatDateRange(block.start_date, block.end_date, block.is_current)}
        </Text>

        {/* Role Level and Store Tier */}
        {(roleLevelInfo || storeTierInfo) && (
          <Text variant="caption" className="mt-2 text-soft-grey">
            {roleLevelInfo && `${roleLevelInfo.code} - ${roleLevelInfo.name}`}
            {roleLevelInfo && storeTierInfo && " • "}
            {storeTierInfo && `${storeTierInfo.code} - ${storeTierInfo.name}`}
          </Text>
        )}

        {/* Division */}
        {divisionInfo && (
          <div className="mt-3">
            <Badge variant="default" size="sm">
              {divisionInfo.name}
            </Badge>
          </div>
        )}

        {/* Responsibilities (truncated) */}
        {block.responsibilities && block.responsibilities.length > 0 && (
          <div className="mt-4">
            <Text variant="caption" className="text-charcoal line-clamp-2">
              {block.responsibilities.slice(0, 2).join(". ")}
              {block.responsibilities.length > 2 && "..."}
            </Text>
          </div>
        )}

        {/* Achievements */}
        {block.achievements && block.achievements.length > 0 && (
          <div className="mt-4">
            <Text variant="label" className="text-charcoal mb-2">
              Achievements
            </Text>
            <ul className="space-y-1">
              {block.achievements.slice(0, 3).map((achievement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-matte-gold mt-1">•</span>
                  <Text variant="caption" className="text-charcoal">
                    {achievement}
                  </Text>
                </li>
              ))}
              {block.achievements.length > 3 && (
                <li>
                  <Text variant="caption" className="text-soft-grey">
                    +{block.achievements.length - 3} more
                  </Text>
                </li>
              )}
            </ul>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
          <Card variant="elevated" className="max-w-md w-full">
            <h3 className="font-sans text-lg font-semibold text-charcoal">
              Delete Experience
            </h3>
            <Text variant="body" className="mt-2 text-soft-grey">
              Are you sure you want to delete this experience? This action cannot
              be undone.
            </Text>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDelete}
                loading={isDeleting}
                className="bg-error hover:bg-error/90"
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
