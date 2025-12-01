-- ============================================================================
-- TAILOR SHIFT V5 - SEED DATA
-- Migration: 0003_seed_data.sql
-- ============================================================================

-- ============================================================================
-- LEARNING MODULES SEED DATA
-- ============================================================================

INSERT INTO learning_modules (title, description, category, content_type, duration_minutes, difficulty, target_role_levels, status, sort_order) VALUES
-- Service Excellence
(
  'Service Excellence Fundamentals',
  'Master the core principles of luxury service delivery. Learn how to create memorable client experiences that embody your maison''s values.',
  'service_excellence',
  'video',
  30,
  'beginner',
  ARRAY['L1','L2'],
  'active',
  1
),
(
  'The Art of First Impressions',
  'Discover techniques for creating impactful first moments with clients, from greeting to initial engagement.',
  'service_excellence',
  'video',
  25,
  'beginner',
  ARRAY['L1','L2','L3'],
  'active',
  2
),
(
  'Handling Difficult Situations with Grace',
  'Learn strategies for managing challenging client interactions while maintaining the highest service standards.',
  'service_excellence',
  'article',
  20,
  'intermediate',
  ARRAY['L2','L3','L4'],
  'active',
  3
),

-- Clienteling
(
  'Introduction to Clienteling',
  'Understand the fundamentals of building and nurturing long-term client relationships in luxury retail.',
  'clienteling',
  'video',
  35,
  'beginner',
  ARRAY['L1','L2'],
  'active',
  10
),
(
  'Advanced Clienteling Techniques',
  'Build lasting relationships with VIC clients through personalized outreach and anticipatory service.',
  'clienteling',
  'article',
  45,
  'intermediate',
  ARRAY['L2','L3','L4'],
  'active',
  11
),
(
  'VIC Portfolio Management',
  'Master the art of managing a portfolio of Very Important Clients, including communication cadence and event planning.',
  'clienteling',
  'exercise',
  60,
  'advanced',
  ARRAY['L3','L4','L5'],
  'active',
  12
),
(
  'Data-Driven Clienteling',
  'Leverage CRM tools and client data to personalize interactions and predict client needs.',
  'clienteling',
  'article',
  40,
  'intermediate',
  ARRAY['L2','L3','L4'],
  'active',
  13
),

-- Operations
(
  'Inventory Management Best Practices',
  'Optimize stock levels, reduce shrinkage, and ensure product availability for your clients.',
  'operations',
  'exercise',
  40,
  'intermediate',
  ARRAY['L3','L4','L5'],
  'active',
  20
),
(
  'Visual Merchandising Standards',
  'Learn the principles of luxury visual presentation and how to maintain impeccable store standards.',
  'operations',
  'video',
  35,
  'beginner',
  ARRAY['L1','L2','L3'],
  'active',
  21
),
(
  'Loss Prevention Strategies',
  'Understand common shrinkage causes and implement effective prevention measures without impacting client experience.',
  'operations',
  'article',
  30,
  'intermediate',
  ARRAY['L3','L4','L5'],
  'active',
  22
),

-- Leadership
(
  'Leading High-Performance Teams',
  'Coaching and motivating luxury retail teams to achieve exceptional results.',
  'leadership',
  'video',
  60,
  'advanced',
  ARRAY['L4','L5','L6'],
  'active',
  30
),
(
  'Effective Team Communication',
  'Master the art of clear, motivating communication that aligns your team with maison objectives.',
  'leadership',
  'article',
  35,
  'intermediate',
  ARRAY['L3','L4','L5'],
  'active',
  31
),
(
  'Performance Management in Luxury Retail',
  'Learn to set meaningful KPIs, conduct effective reviews, and develop talent within your team.',
  'leadership',
  'exercise',
  50,
  'advanced',
  ARRAY['L4','L5','L6'],
  'active',
  32
),
(
  'Strategic Planning for Boutique Directors',
  'Develop skills for annual planning, budget management, and strategic decision-making.',
  'leadership',
  'video',
  75,
  'advanced',
  ARRAY['L5','L6','L7'],
  'active',
  33
),

-- Product Knowledge
(
  'Understanding Luxury Materials',
  'Deep dive into the materials that define luxury: leathers, precious metals, gemstones, and fine fabrics.',
  'product_knowledge',
  'video',
  45,
  'beginner',
  ARRAY['L1','L2','L3'],
  'active',
  40
),
(
  'Heritage and Craftsmanship Stories',
  'Learn to articulate the history, savoir-faire, and craftsmanship that make each maison unique.',
  'product_knowledge',
  'article',
  40,
  'intermediate',
  ARRAY['L2','L3','L4'],
  'active',
  41
);
