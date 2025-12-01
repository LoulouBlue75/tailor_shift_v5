// Design System Components - Tailor Shift V5

// Button
export { Button, type ButtonProps } from "./Button";

// Input
export { Input, type InputProps } from "./Input";

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
} from "./Card";

// Badge
export { Badge, type BadgeProps } from "./Badge";

// Typography
export { H1, H2, H3, Text, type H1Props, type H2Props, type H3Props, type TextProps } from "./Typography";

// Layout
export {
  Container,
  Stack,
  Grid,
  Divider,
  type ContainerProps,
  type StackProps,
  type GridProps,
  type DividerProps,
} from "./Layout";

// Skeleton (Loading States)
export {
  Skeleton,
  CardSkeleton,
  OpportunityCardSkeleton,
  ProfileSkeleton,
  TableRowSkeleton,
  DashboardSkeleton,
  LearningModuleSkeleton,
  type SkeletonProps,
} from "./Skeleton";

// Empty States
export {
  EmptyState,
  NoOpportunitiesState,
  NoMatchesState,
  NoStoresState,
  NoExperienceState,
  NoLearningModulesState,
  NoResultsState,
  type EmptyStateProps,
} from "./EmptyState";

// Toast Notifications
export {
  ToastProvider,
  useToast,
  useToastActions,
} from "./Toast";

// Confirmation Dialog
export {
  ConfirmDialog,
  useConfirmDialog,
  type ConfirmDialogProps,
} from "./ConfirmDialog";

// Breadcrumb Navigation
export {
  Breadcrumb,
  TalentDashboardBreadcrumb,
  TalentOpportunitiesBreadcrumb,
  TalentOpportunityDetailBreadcrumb,
  TalentLearningBreadcrumb,
  TalentLearningModuleBreadcrumb,
  BrandDashboardBreadcrumb,
  BrandOpportunitiesBreadcrumb,
  BrandOpportunityDetailBreadcrumb,
  BrandStoresBreadcrumb,
  BrandStoreDetailBreadcrumb,
  BrandMatchesBreadcrumb,
  type BreadcrumbProps,
  type BreadcrumbItem,
} from "./Breadcrumb";

// Phone Input
export { PhoneInput } from "./PhoneInput";
