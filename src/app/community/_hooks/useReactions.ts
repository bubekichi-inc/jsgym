"use client";

import { useCallback } from "react";
import { ReactionRequest } from "../../api/community/reactions/route";
import { api } from "@/app/_utils/api";
import { ReactionKind } from "@prisma/client";

export const useReactions = (onReactionChange?: () => void) => {
  // Toggle a reaction on a post
  const toggleReaction = useCallback(
    async (postId: string, kind: ReactionKind) => {
      try {
        await api.post<ReactionRequest, { message: string; added: boolean }>(
          "/api/community/reactions",
          {
            postId,
            kind,
          }
        );
        
        // Call callback if provided
        if (onReactionChange) {
          onReactionChange();
        }
      } catch (error) {
        console.error("Error toggling reaction:", error);
      }
    },
    [onReactionChange]
  );

  return {
    toggleReaction,
  };
};