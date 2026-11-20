// ==============================================================================
// NelovMallickIITD · Subject Resources Hub Router Component
// Switches between Level 2 (Chapters Grid) and Level 3 (Chapter Detail View)
// Supports Physics (28), Chemistry (29), and Mathematics (26)
// ==============================================================================

import React, { useState } from 'react';
import { SubjectChaptersGrid } from './SubjectChaptersGrid';
import { SubjectChapterDetail } from './SubjectChapterDetail';
import { ExerciseTestShellModal } from '../physics/ExerciseTestShellModal';
import { physicsChaptersData } from '../../data/physicsChapters';
import { chemistryChaptersData } from '../../data/chemistryChapters';
import { mathsChaptersData } from '../../data/mathsChapters';

interface SubjectResourcesHubProps {
  subject: 'physics' | 'chemistry' | 'mathematics';
  currentHash: string;
  onNavigate: (hash: string) => void;
  user?: any;
}

export const SubjectResourcesHub: React.FC<SubjectResourcesHubProps> = ({
  subject,
  currentHash,
  onNavigate,
  user
}) => {
  const [activeExerciseModal, setActiveExerciseModal] = useState<{
    isOpen: boolean;
    chapter?: any;
    exercise?: any;
  }>({ isOpen: false });

  // Get data list
  const chapters = React.useMemo(() => {
    switch (subject) {
      case 'chemistry':
        return chemistryChaptersData;
      case 'mathematics':
        return mathsChaptersData;
      case 'physics':
      default:
        return physicsChaptersData;
    }
  }, [subject]);

  // Determine if active on a specific chapter (e.g. #/resources/physics/c8 or #/resources/chemistry/ch-3)
  const basePath = `#/resources/${subject}`;
  const chapterSlug = currentHash.startsWith(`${basePath}/`)
    ? currentHash.replace(`${basePath}/`, '').split('?')[0].toLowerCase()
    : null;

  const activeChapter = chapterSlug
    ? chapters.find(
        (ch) =>
          ch.id.toLowerCase() === chapterSlug ||
          ch.code.toLowerCase().replace(/\s+/g, '-') === chapterSlug ||
          ch.code.toLowerCase() === chapterSlug
      )
    : null;

  const handleSelectChapter = (id: string) => {
    onNavigate(`${basePath}/${id}`);
  };

  const handleBackToSubject = () => {
    onNavigate(basePath);
  };

  const handleBackToHub = () => {
    onNavigate('#/resources');
  };

  const handleNavigateHome = () => {
    onNavigate('#/');
  };

  const handleLaunchExercise = (chapter: any, exercise: any) => {
    setActiveExerciseModal({
      isOpen: true,
      chapter,
      exercise
    });
  };

  return (
    <>
      {activeChapter ? (
        <SubjectChapterDetail
          subject={subject}
          chapter={activeChapter}
          onBackToSubject={handleBackToSubject}
          onNavigateHome={handleNavigateHome}
          onLaunchExercise={(ex) => handleLaunchExercise(activeChapter, ex)}
        />
      ) : (
        <SubjectChaptersGrid
          subject={subject}
          chapters={chapters}
          onSelectChapter={handleSelectChapter}
          onBackToHub={handleBackToHub}
          onNavigateHome={handleNavigateHome}
        />
      )}

      {/* CBT Test Shell Modal */}
      {activeExerciseModal.isOpen && activeExerciseModal.chapter && activeExerciseModal.exercise && (
        <ExerciseTestShellModal
          isOpen={activeExerciseModal.isOpen}
          onClose={() => setActiveExerciseModal({ isOpen: false })}
          chapter={activeExerciseModal.chapter}
          exercise={activeExerciseModal.exercise}
          subject={subject}
          studentName={user?.user_metadata?.full_name || user?.email || 'Guest Student'}
        />
      )}
    </>
  );
};
