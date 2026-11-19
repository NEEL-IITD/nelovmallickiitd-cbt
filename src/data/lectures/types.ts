export type LectureSubject = 'Physics' | 'Chemistry' | 'Mathematics' | 'General';

export interface Lecture {
  lectureNumber: string;
  lectureIndex: number;
  title: string;
  videoId: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  duration: string;
}

export interface ChapterPlaylist {
  id: string;
  slug: string;
  chapterName: string;
  subject: LectureSubject;
  description: string;
  playlistId: string;
  playlistUrl: string;
  thumbnailUrl: string;
  lectureCount: number;
  lectures: Lecture[];
}

export interface LectureProgress {
  userId: string;
  chapterSlug: string;
  videoId: string;
  lectureNumber: string;
  completed: boolean;
  personalNote?: string;
  updatedAt: string;
}
