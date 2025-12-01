/**
 * Learning Modules Seed Data
 * 15 modules across 6 categories
 */

export type LearningCategory =
  | 'service_excellence'
  | 'clienteling'
  | 'operations'
  | 'leadership'
  | 'product_knowledge'
  | 'soft_skills'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type ContentType = 'article' | 'video' | 'quiz' | 'exercise'

export interface LearningModule {
  id: string
  title: string
  description: string
  category: LearningCategory
  duration_minutes: number
  difficulty: Difficulty
  content_type: ContentType
  content_url: string
  target_role_levels: string[]
  target_gaps: string[]
}

export const LEARNING_MODULES: LearningModule[] = [
  // SERVICE EXCELLENCE (4 modules)
  {
    id: 'se-fundamentals',
    title: 'Service Excellence Fundamentals',
    description:
      'Master the core principles of luxury service delivery, from greeting to farewell. Learn the art of anticipating needs and exceeding expectations.',
    category: 'service_excellence',
    duration_minutes: 30,
    difficulty: 'beginner',
    content_type: 'video',
    content_url: 'https://example.com/modules/service-fundamentals',
    target_role_levels: ['L1', 'L2'],
    target_gaps: ['service_excellence'],
  },
  {
    id: 'se-personalization',
    title: 'Personalizing the Luxury Experience',
    description:
      'Advanced techniques for creating memorable, personalized moments that build lasting impressions and drive loyalty.',
    category: 'service_excellence',
    duration_minutes: 45,
    difficulty: 'intermediate',
    content_type: 'article',
    content_url: 'https://example.com/modules/personalization',
    target_role_levels: ['L2', 'L3'],
    target_gaps: ['service_excellence'],
  },
  {
    id: 'se-recovery',
    title: 'Service Recovery & Complaint Handling',
    description:
      'Turn challenging situations into opportunities. Master the art of graceful service recovery and maintaining client relationships during difficulties.',
    category: 'service_excellence',
    duration_minutes: 35,
    difficulty: 'intermediate',
    content_type: 'exercise',
    content_url: 'https://example.com/modules/service-recovery',
    target_role_levels: ['L2', 'L3', 'L4'],
    target_gaps: ['service_excellence'],
  },
  {
    id: 'se-standards',
    title: 'Luxury Service Standards Mastery',
    description:
      'Deep dive into luxury service protocols, etiquette, and standards that define excellence in high-end retail environments.',
    category: 'service_excellence',
    duration_minutes: 40,
    difficulty: 'advanced',
    content_type: 'video',
    content_url: 'https://example.com/modules/luxury-standards',
    target_role_levels: ['L3', 'L4', 'L5'],
    target_gaps: ['service_excellence'],
  },

  // CLIENTELING (4 modules)
  {
    id: 'cl-basics',
    title: 'Introduction to Clienteling',
    description:
      'Learn the fundamentals of building client relationships, CRM usage, and the importance of personalized service in luxury retail.',
    category: 'clienteling',
    duration_minutes: 25,
    difficulty: 'beginner',
    content_type: 'article',
    content_url: 'https://example.com/modules/clienteling-basics',
    target_role_levels: ['L1', 'L2'],
    target_gaps: ['clienteling'],
  },
  {
    id: 'cl-advanced',
    title: 'Advanced Clienteling Techniques',
    description:
      'Build lasting relationships with VIC clients through strategic engagement, personalized communications, and thoughtful touchpoints.',
    category: 'clienteling',
    duration_minutes: 45,
    difficulty: 'intermediate',
    content_type: 'video',
    content_url: 'https://example.com/modules/advanced-clienteling',
    target_role_levels: ['L2', 'L3', 'L4'],
    target_gaps: ['clienteling'],
  },
  {
    id: 'cl-vic',
    title: 'VIC Management Excellence',
    description:
      'Master the art of managing Very Important Client relationships, including portfolio management, event planning, and strategic outreach.',
    category: 'clienteling',
    duration_minutes: 50,
    difficulty: 'advanced',
    content_type: 'exercise',
    content_url: 'https://example.com/modules/vic-management',
    target_role_levels: ['L3', 'L4', 'L5'],
    target_gaps: ['clienteling'],
  },
  {
    id: 'cl-digital',
    title: 'Digital Clienteling Strategies',
    description:
      'Leverage digital tools and social media to maintain client relationships, share product updates, and drive engagement in the modern era.',
    category: 'clienteling',
    duration_minutes: 35,
    difficulty: 'intermediate',
    content_type: 'article',
    content_url: 'https://example.com/modules/digital-clienteling',
    target_role_levels: ['L2', 'L3', 'L4'],
    target_gaps: ['clienteling'],
  },

  // OPERATIONS (3 modules)
  {
    id: 'op-inventory',
    title: 'Inventory Management Best Practices',
    description:
      'Optimize stock levels, reduce shrinkage, maintain accuracy, and ensure product availability while managing costs effectively.',
    category: 'operations',
    duration_minutes: 40,
    difficulty: 'intermediate',
    content_type: 'exercise',
    content_url: 'https://example.com/modules/inventory-management',
    target_role_levels: ['L3', 'L4', 'L5'],
    target_gaps: ['operations'],
  },
  {
    id: 'op-visual',
    title: 'Visual Merchandising Excellence',
    description:
      'Create compelling product displays, maintain visual standards, and understand the psychology of luxury presentation.',
    category: 'operations',
    duration_minutes: 30,
    difficulty: 'intermediate',
    content_type: 'video',
    content_url: 'https://example.com/modules/visual-merchandising',
    target_role_levels: ['L2', 'L3', 'L4'],
    target_gaps: ['operations'],
  },
  {
    id: 'op-systems',
    title: 'Retail Systems & Technology',
    description:
      'Master POS systems, inventory management software, CRM tools, and other essential retail technologies for operational efficiency.',
    category: 'operations',
    duration_minutes: 35,
    difficulty: 'beginner',
    content_type: 'article',
    content_url: 'https://example.com/modules/retail-systems',
    target_role_levels: ['L1', 'L2', 'L3'],
    target_gaps: ['operations'],
  },

  // LEADERSHIP (3 modules)
  {
    id: 'ld-teams',
    title: 'Leading High-Performance Teams',
    description:
      'Coaching, motivating, and developing luxury retail teams. Learn to inspire excellence and drive results through effective leadership.',
    category: 'leadership',
    duration_minutes: 60,
    difficulty: 'advanced',
    content_type: 'video',
    content_url: 'https://example.com/modules/leading-teams',
    target_role_levels: ['L4', 'L5', 'L6'],
    target_gaps: ['leadership_signals'],
  },
  {
    id: 'ld-coaching',
    title: 'Coaching for Excellence',
    description:
      'Develop your coaching skills to unlock potential in team members, provide constructive feedback, and foster continuous improvement.',
    category: 'leadership',
    duration_minutes: 45,
    difficulty: 'intermediate',
    content_type: 'exercise',
    content_url: 'https://example.com/modules/coaching-excellence',
    target_role_levels: ['L3', 'L4', 'L5'],
    target_gaps: ['leadership_signals'],
  },
  {
    id: 'ld-conflict',
    title: 'Conflict Resolution & Team Dynamics',
    description:
      'Navigate team conflicts gracefully, build positive work environments, and maintain harmony while driving performance.',
    category: 'leadership',
    duration_minutes: 40,
    difficulty: 'intermediate',
    content_type: 'article',
    content_url: 'https://example.com/modules/conflict-resolution',
    target_role_levels: ['L3', 'L4', 'L5', 'L6'],
    target_gaps: ['leadership_signals'],
  },

  // PRODUCT KNOWLEDGE (1 module)
  {
    id: 'pk-leather',
    title: 'Product Knowledge: Leather Goods Craftsmanship',
    description:
      'Deep dive into luxury leather goods materials, techniques, heritage, and storytelling. Learn to communicate product value compellingly.',
    category: 'product_knowledge',
    duration_minutes: 35,
    difficulty: 'intermediate',
    content_type: 'article',
    content_url: 'https://example.com/modules/leather-craftsmanship',
    target_role_levels: ['L1', 'L2', 'L3'],
    target_gaps: [],
  },

  // SOFT SKILLS (1 module)
  {
    id: 'ss-communication',
    title: 'Effective Communication in Luxury Retail',
    description:
      'Master verbal and non-verbal communication, active listening, and the art of elegant conversation in professional settings.',
    category: 'soft_skills',
    duration_minutes: 30,
    difficulty: 'beginner',
    content_type: 'video',
    content_url: 'https://example.com/modules/effective-communication',
    target_role_levels: ['L1', 'L2', 'L3'],
    target_gaps: [],
  },
]
