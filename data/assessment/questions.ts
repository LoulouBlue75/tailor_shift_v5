/**
 * Assessment Questions V1
 * Retail Excellence Scan - 12 questions across 4 dimensions
 */

export type AssessmentDimension = 
  | 'service_excellence' 
  | 'clienteling' 
  | 'operations' 
  | 'leadership_signals'

export type QuestionType = 'multiple_choice' | 'likert' | 'situational'

export interface AssessmentOption {
  id: string
  text: string
  score: number // 0-1
}

export interface AssessmentQuestion {
  id: string
  dimension: AssessmentDimension
  type: QuestionType
  text: string
  options: AssessmentOption[]
  weight: number
  explanation?: string
}

export const ASSESSMENT_QUESTIONS_V1: AssessmentQuestion[] = [
  // SERVICE EXCELLENCE (3 questions)
  {
    id: 'se-1',
    dimension: 'service_excellence',
    type: 'multiple_choice',
    text: 'A VIP client enters the boutique looking frustrated. What is your first action?',
    options: [
      { 
        id: 'a', 
        text: 'Immediately approach and ask how you can assist', 
        score: 1 
      },
      { 
        id: 'b', 
        text: 'Observe from a distance to assess their mood', 
        score: 0.3 
      },
      { 
        id: 'c', 
        text: 'Alert your manager before approaching', 
        score: 0.5 
      },
      { 
        id: 'd', 
        text: 'Wait for them to approach the counter', 
        score: 0 
      },
    ],
    weight: 1.0,
    explanation: 'Proactive, empathetic service is key in luxury retail.',
  },
  {
    id: 'se-2',
    dimension: 'service_excellence',
    type: 'likert',
    text: 'On a scale of 1-5, how important is it to follow up with a client after a significant purchase?',
    options: [
      { id: '1', text: 'Not important', score: 0 },
      { id: '2', text: 'Slightly important', score: 0.25 },
      { id: '3', text: 'Moderately important', score: 0.5 },
      { id: '4', text: 'Very important', score: 0.75 },
      { id: '5', text: 'Extremely important', score: 1 },
    ],
    weight: 0.8,
    explanation: 'Post-purchase follow-up strengthens relationships and builds loyalty.',
  },
  {
    id: 'se-3',
    dimension: 'service_excellence',
    type: 'situational',
    text: 'You notice a client admiring a product but hesitating. How do you proceed?',
    options: [
      { 
        id: 'a', 
        text: 'Give them space to decide on their own', 
        score: 0.3 
      },
      { 
        id: 'b', 
        text: 'Approach and share the product story and craftsmanship', 
        score: 1 
      },
      { 
        id: 'c', 
        text: 'Offer a discount to encourage purchase', 
        score: 0 
      },
      { 
        id: 'd', 
        text: 'Suggest a cheaper alternative', 
        score: 0.2 
      },
    ],
    weight: 1.2,
    explanation: 'Storytelling and education create value in luxury sales.',
  },

  // CLIENTELING (3 questions)
  {
    id: 'cl-1',
    dimension: 'clienteling',
    type: 'multiple_choice',
    text: 'How often should you contact a VIC (Very Important Client)?',
    options: [
      { 
        id: 'a', 
        text: 'Only when they visit the boutique', 
        score: 0.2 
      },
      { 
        id: 'b', 
        text: 'Monthly, regardless of purchase activity', 
        score: 0.4 
      },
      { 
        id: 'c', 
        text: 'Based on their preferences and purchase patterns', 
        score: 1 
      },
      { 
        id: 'd', 
        text: 'Weekly to ensure top-of-mind', 
        score: 0.3 
      },
    ],
    weight: 1.0,
    explanation: 'Personalized frequency based on client preferences is most effective.',
  },
  {
    id: 'cl-2',
    dimension: 'clienteling',
    type: 'situational',
    text: 'A client mentions they\'re traveling to Paris next month. What do you do?',
    options: [
      { 
        id: 'a', 
        text: 'Note it in CRM for future reference', 
        score: 0.4 
      },
      { 
        id: 'b', 
        text: 'Immediately connect them with Paris boutique and set an appointment', 
        score: 1 
      },
      { 
        id: 'c', 
        text: 'Wish them a great trip', 
        score: 0.1 
      },
      { 
        id: 'd', 
        text: 'Offer to ship products to Paris', 
        score: 0.3 
      },
    ],
    weight: 1.3,
    explanation: 'Proactive global service creates exceptional experiences.',
  },
  {
    id: 'cl-3',
    dimension: 'clienteling',
    type: 'multiple_choice',
    text: 'What is the most important information to track about a VIC client?',
    options: [
      { 
        id: 'a', 
        text: 'Their purchase history and spending', 
        score: 0.5 
      },
      { 
        id: 'b', 
        text: 'Their personal preferences, interests, and special occasions', 
        score: 1 
      },
      { 
        id: 'c', 
        text: 'Their contact information', 
        score: 0.2 
      },
      { 
        id: 'd', 
        text: 'Their complaints or issues', 
        score: 0.4 
      },
    ],
    weight: 1.1,
    explanation: 'Understanding personal details enables meaningful personalization.',
  },

  // OPERATIONS (3 questions)
  {
    id: 'op-1',
    dimension: 'operations',
    type: 'situational',
    text: 'During inventory, you find a discrepancy. What is your priority?',
    options: [
      { 
        id: 'a', 
        text: 'Report to manager immediately', 
        score: 0.5 
      },
      { 
        id: 'b', 
        text: 'Re-count to verify the discrepancy', 
        score: 0.7 
      },
      { 
        id: 'c', 
        text: 'Document and investigate root cause', 
        score: 1 
      },
      { 
        id: 'd', 
        text: 'Adjust system to match physical count', 
        score: 0 
      },
    ],
    weight: 1.0,
    explanation: 'Systematic problem-solving prevents recurring issues.',
  },
  {
    id: 'op-2',
    dimension: 'operations',
    type: 'multiple_choice',
    text: 'What is the most critical aspect of opening procedures?',
    options: [
      { 
        id: 'a', 
        text: 'Arriving on time', 
        score: 0.3 
      },
      { 
        id: 'b', 
        text: 'Security and cash handling protocols', 
        score: 1 
      },
      { 
        id: 'c', 
        text: 'Turning on lights and music', 
        score: 0.1 
      },
      { 
        id: 'd', 
        text: 'Checking emails', 
        score: 0.2 
      },
    ],
    weight: 0.9,
    explanation: 'Security protocols protect assets and ensure compliance.',
  },
  {
    id: 'op-3',
    dimension: 'operations',
    type: 'likert',
    text: 'Rate the importance of maintaining visual merchandising standards throughout the day.',
    options: [
      { id: '1', text: 'Not important', score: 0 },
      { id: '2', text: 'Slightly important', score: 0.25 },
      { id: '3', text: 'Moderately important', score: 0.5 },
      { id: '4', text: 'Very important', score: 0.75 },
      { id: '5', text: 'Extremely important', score: 1 },
    ],
    weight: 0.8,
    explanation: 'Consistent visual standards maintain brand excellence.',
  },

  // LEADERSHIP SIGNALS (3 questions)
  {
    id: 'ls-1',
    dimension: 'leadership_signals',
    type: 'situational',
    text: 'A junior team member is struggling with clienteling. How do you help?',
    options: [
      { 
        id: 'a', 
        text: 'Do it for them to ensure quality', 
        score: 0.2 
      },
      { 
        id: 'b', 
        text: 'Provide specific examples and coach through next interaction', 
        score: 1 
      },
      { 
        id: 'c', 
        text: 'Tell them to read the training materials', 
        score: 0.3 
      },
      { 
        id: 'd', 
        text: 'Escalate to manager', 
        score: 0.1 
      },
    ],
    weight: 1.2,
    explanation: 'Coaching and mentoring develop team capabilities.',
  },
  {
    id: 'ls-2',
    dimension: 'leadership_signals',
    type: 'multiple_choice',
    text: 'When a conflict arises between team members, what is your approach?',
    options: [
      { 
        id: 'a', 
        text: 'Avoid getting involved, let them work it out', 
        score: 0.1 
      },
      { 
        id: 'b', 
        text: 'Listen to both sides and facilitate a resolution', 
        score: 1 
      },
      { 
        id: 'c', 
        text: 'Take one person\'s side', 
        score: 0 
      },
      { 
        id: 'd', 
        text: 'Immediately escalate to management', 
        score: 0.4 
      },
    ],
    weight: 1.1,
    explanation: 'Effective conflict resolution maintains team harmony.',
  },
  {
    id: 'ls-3',
    dimension: 'leadership_signals',
    type: 'likert',
    text: 'How important is it to recognize and celebrate team members\' achievements?',
    options: [
      { id: '1', text: 'Not important', score: 0 },
      { id: '2', text: 'Slightly important', score: 0.25 },
      { id: '3', text: 'Moderately important', score: 0.5 },
      { id: '4', text: 'Very important', score: 0.75 },
      { id: '5', text: 'Extremely important', score: 1 },
    ],
    weight: 0.9,
    explanation: 'Recognition drives motivation and engagement.',
  },
]

export const ASSESSMENT_VERSION = 'v1'
