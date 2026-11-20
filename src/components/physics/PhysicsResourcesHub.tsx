// ==============================================================================
// NelovMallickIITD · Physics Resources Main Hub Orchestrator
// Coordinates Level 2 (28 Chapter Grid) and Level 3 (Chapter Detail & CBT Tests)
// ==============================================================================

import React, { useMemo } from 'react';
import { getChapterById } from '../../data/physicsChapters';
import { Level2ChaptersGrid } from './Level2ChaptersGrid';
import { Level3ChapterDetail } from './Level3ChapterDetail';

interface PhysicsResourcesHubProps {
  currentHash: string;
  onNavigate: (hash: string) => void;
  user?: any;
}

export const PhysicsResourcesHub: React.FC<PhysicsResourcesHubProps> = ({
  currentHash,
  onNavigate,
  user
}) => {
  // Extract chapter slug from hash (e.g. "#/resources/physics/c8" -> "c8")
  const activeChapterId = useMemo(() => {
    if (currentHash.startsWith('#/resources/physics/')) {
      const slug = currentHash.replace('#/resources/physics/', '').trim().toLowerCase();
      return slug || null;
    }
    return null;
  }, [currentHash]);

  const activeChapter = useMemo(() => {
    if (!activeChapterId) return null;
    return getChapterById(activeChapterId) || null;
  }, [activeChapterId]);

  // Level 3 View: Specific Chapter Page
  if (activeChapter) {
    return (
      <Level3ChapterDetail
        chapter={activeChapter}
        onBackToGrid={() => onNavigate('#/resources/physics')}
        onNavigateHome={() => onNavigate('#/')}
        user={user}
      />
    );
  }

  // Level 2 View: 28 Chapters Grid
  return (
    <Level2ChaptersGrid
      onSelectChapter={(chapterId) => onNavigate(`#/resources/physics/${chapterId}`)}
      onNavigateHome={() => onNavigate('#/')}
    />
  );
};
