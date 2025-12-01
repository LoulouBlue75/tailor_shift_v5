# STORY-017: Settings Pages

## Status: COMPLETED ✓

## Overview
Implement settings pages for both Talent and Brand users, including account management, notification preferences, and privacy settings.

## Story Dependencies
- STORY-003: Auth System (complete)
- STORY-004: Database Schema (complete)
- STORY-005: Talent Onboarding (complete)
- STORY-008: Brand Onboarding (complete)

## Routes Implemented
- `/talent/settings` — Talent account settings ✓
- `/brand/settings` — Brand account settings ✓
- `/brand/profile` — Brand profile view/edit ✓

## Acceptance Criteria

### Talent Settings Page ✓
- [x] Display current account information (email, name)
- [x] Allow password change (via Supabase Auth)
- [x] Notification preferences (email notifications, match alerts, learning reminders)
- [x] Privacy settings (profile visibility, compensation alignment toggle)
- [x] Account deletion request option
- [x] Link to privacy policy and terms
- [x] Sign out functionality

### Brand Settings Page ✓
- [x] Display current account information (email, brand name)
- [x] Allow password change (via Supabase Auth)
- [x] Notification preferences (email notifications, match alerts, weekly digest)
- [x] Account deletion request option
- [x] Link to privacy policy and terms
- [x] Sign out functionality
- [x] Link to edit brand profile

### Brand Profile Page ✓
- [x] Display brand information (name, logo, website, segment)
- [x] Edit brand details (name, website, segment)
- [x] Contact information management (name, role, email, phone)
- [x] Display divisions and headquarters
- [x] Verified badge display
- [x] Quick links to stores, opportunities, settings

## Files Created

### Settings Server Actions
```
app/actions/settings.ts
- requestPasswordReset()
- updateTalentNotifications(formData)
- updateTalentPrivacy(formData)
- requestAccountDeletion(reason?)
- updateBrandProfile(formData)
- updateBrandNotifications(formData)
- signOut()
```

### Pages
```
app/(talent)/talent/settings/page.tsx
app/(brand)/brand/settings/page.tsx
app/(brand)/brand/profile/page.tsx
```

## Implementation Details

### Talent Settings Features
- Account information display (name, email)
- Password change via Supabase email reset
- Toggle notifications: email, match alerts, learning reminders
- Privacy settings: profile visibility dropdown, compensation alignment toggle
- Danger zone with account deletion confirmation

### Brand Settings Features
- Account information display (brand name, email)
- Password change via Supabase email reset
- Toggle notifications: email, new match alerts, weekly digest
- Link to brand profile edit page
- Danger zone with account deletion confirmation

### Brand Profile Features
- View/edit mode toggle
- Brand identity section (name, website, segment, divisions, logo)
- Contact information section (name, role, email, phone)
- Quick links to related pages
- Member since date display

## Technical Notes

### Storage Strategy
- Talent preferences stored in `career_preferences` JSONB field
- Brand notifications stored in Supabase user metadata
- Account deletion request stored in user metadata (V1 soft-delete approach)

### Password Reset Flow
- Uses Supabase's built-in `resetPasswordForEmail`
- Redirects to `/auth/reset-password` with token

### Privacy Visibility Options
- `visible_to_brands` - Default, brands can see profile
- `hidden` - Profile hidden from all
- `visible_to_matches` - Only matched brands can see

## Build Verification
- [x] All 39 routes compile successfully
- [x] No type errors blocking build
- [x] New routes accessible: /talent/settings, /brand/settings, /brand/profile

## Notes
- Account deletion is a "request" that flags the account in V1
- Actual deletion workflow would be implemented in V2 with admin review
- All forms use optimistic UI with proper loading/saving states
- Error messages displayed for failed operations
- Success messages confirm saved changes
