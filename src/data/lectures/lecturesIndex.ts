import { ChapterPlaylist } from './types';
import { aldehydes_ketones_carboxylic_acids } from './chapters/aldehydes-ketones-carboxylic-acids';
import { alcohols_phenols_ethers } from './chapters/alcohols-phenols-ethers';
import { haloalkanes_haloarenes } from './chapters/haloalkanes-haloarenes';
import { hydrocarbons } from './chapters/hydrocarbons';
import { reaction_mechanisms_and_named_reactions } from './chapters/reaction-mechanisms-and-named-reactions';
import { chemical_kinetics } from './chapters/chemical-kinetics';
import { reaction_intermediates } from './chapters/reaction-intermediates';
import { electrochemistry } from './chapters/electrochemistry';
import { general_organic_chemistry } from './chapters/general-organic-chemistry';
import { isomerism_and_stereochemistry } from './chapters/isomerism-and-stereochemistry';
import { ionic_equilibrium } from './chapters/ionic-equilibrium';
import { thermodynamics_and_thermochemistry } from './chapters/thermodynamics-and-thermochemistry';
import { ch_1600_questions_mega_practice_session } from './chapters/1600-questions-mega-practice-session';
import { cbt_mock_test_series_video_solutions } from './chapters/cbt-mock-test-series-video-solutions';
import { chemical_bonding_masterclass } from './chapters/chemical-bonding-masterclass';
import { jee_advanced_ultimate_mock_series } from './chapters/jee-advanced-ultimate-mock-series';
import { jee_mains_january_2025_solutions } from './chapters/jee-mains-january-2025-solutions';
import { jee_advanced_pyq_series } from './chapters/jee-advanced-pyq-series';

export * from './types';

export const YOUTUBE_CHANNEL_ID = "UCVyHQJik6Gz4QZJBvviY7Hg";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/channel/UCVyHQJik6Gz4QZJBvviY7Hg";

export const allChapters: ChapterPlaylist[] = [
  aldehydes_ketones_carboxylic_acids,
  alcohols_phenols_ethers,
  haloalkanes_haloarenes,
  hydrocarbons,
  reaction_mechanisms_and_named_reactions,
  chemical_kinetics,
  reaction_intermediates,
  electrochemistry,
  general_organic_chemistry,
  isomerism_and_stereochemistry,
  ionic_equilibrium,
  thermodynamics_and_thermochemistry,
  ch_1600_questions_mega_practice_session,
  cbt_mock_test_series_video_solutions,
  chemical_bonding_masterclass,
  jee_advanced_ultimate_mock_series,
  jee_mains_january_2025_solutions,
  jee_advanced_pyq_series
];

export const getChapterBySlug = (slug: string): ChapterPlaylist | undefined => {
  return allChapters.find(ch => ch.slug === slug);
};

export const getChaptersBySubject = (subject: string): ChapterPlaylist[] => {
  if (subject === 'All') return allChapters;
  return allChapters.filter(ch => ch.subject.toLowerCase() === subject.toLowerCase());
};
