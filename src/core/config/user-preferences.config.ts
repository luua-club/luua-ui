import { BookOpen, Eye, Flame, FlaskConical, GraduationCap } from 'lucide-react'

import { WritingStyleChip } from '@/shared/models/style-chip.model'

export const writingStyles: WritingStyleChip[] = [
  {
    id: 'the_expert',
    title: 'The Expert',
    description: 'Authoritative, insightful, and confident',
    llm_info: 'Uses more data, assumes a knowledgeable audience',
    icon: GraduationCap,
    color: 'bg-yellow-200 dark:bg-yellow-400',
  },
  {
    id: 'the_friendly_guide',
    title: 'The Friendly Guide',
    description: 'Approachable, helpful, and clear',
    llm_info: 'Breaks down complex topics, uses simpler language',
    icon: BookOpen,
    color: 'bg-green-200 dark:bg-green-400',
  },
  {
    id: 'the_visionary',
    title: 'The Visionary',
    description: 'Inspiring, bold, and forward-looking',
    llm_info: 'Focuses on trends, ideas, and storytelling',
    icon: Eye,
    color: 'bg-red-200 dark:bg-red-400',
  },
  {
    id: 'the_analyst',
    title: 'The Analyst',
    description: 'Data-driven, precise, and objective',
    llm_info: 'Uses numbers, facts, and logical reasoning',
    icon: FlaskConical,
    color: 'bg-blue-200 dark:bg-blue-400',
  },
  {
    id: 'the_challenger',
    title: 'The Challenger',
    description: 'Provocative, opinionated, and direct',
    llm_info: 'Designed to spark debate and strong reactions',
    icon: Flame,
    color: 'bg-orange-200 dark:bg-orange-400',
  },
]
