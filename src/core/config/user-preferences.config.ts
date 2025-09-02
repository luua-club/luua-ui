import {
  IconBooks,
  IconCampfire,
  IconEyeDollar,
  IconFlask,
  IconSchool,
} from '@tabler/icons-react'

import { WritingStyleChip } from '@/shared/models/style-chip.model'

export const writingStyles: WritingStyleChip[] = [
  {
    id: 'the_expert',
    title: 'The Expert',
    description: 'Authoritative, insightful, and confident',
    llm_info: 'Uses more data, assumes a knowledgeable audience',
    icon: IconSchool,
    color: 'bg-yellow-200',
  },
  {
    id: 'the_friendly_guide',
    title: 'The Friendly Guide',
    description: 'Approachable, helpful, and clear',
    llm_info: 'Breaks down complex topics, uses simpler language',
    icon: IconBooks,
    color: 'bg-green-200',
  },
  {
    id: 'the_visionary',
    title: 'The Visionary',
    description: 'Inspiring, bold, and forward-looking',
    llm_info: 'Focuses on trends, ideas, and storytelling',
    icon: IconEyeDollar,
    color: 'bg-red-200',
  },
  {
    id: 'the_analyst',
    title: 'The Analyst',
    description: 'Data-driven, precise, and objective',
    llm_info: 'Uses numbers, facts, and logical reasoning',
    icon: IconFlask,
    color: 'bg-blue-200',
  },
  {
    id: 'the_challenger',
    title: 'The Challenger',
    description: 'Provocative, opinionated, and direct',
    llm_info: 'Designed to spark debate and strong reactions',
    icon: IconCampfire,
    color: 'bg-orange-200',
  },
]
