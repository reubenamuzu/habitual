# Habitual

A mobile habit tracking app built with Expo and React Native. Track daily habits, log your mood, visualize progress with heatmaps and charts, and stay accountable with friends.

## Features

- **Habit Tracking** — Create habits with custom icons, colors, and flexible schedules (daily or specific days). Toggle completions with a single tap.
- **Mood Logging** — Record morning and evening mood scores (1-10) with a simple slider interface.
- **Dashboard & Analytics** — 90-day habit consistency heatmap, mood trend line chart, streak tracking, and completion rates.
- **Social** — Add friends, view their daily activity, and send/accept friend requests.
- **Profile & Stats** — View total habits, best streaks, average mood, and per-habit performance.
- **Dark Mode** — Full light/dark theme support with system preference detection.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo](https://expo.dev) (v54) + React Native |
| Language | TypeScript (strict mode) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, typed routes) |
| Backend | [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage) |
| State | [TanStack React Query](https://tanstack.com/query) |
| Animations | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| Charts | [React Native SVG](https://github.com/software-mansion/react-native-svg) |
| Forms | React Hook Form + Zod validation |
| Fonts | Inter (Google Fonts) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A Supabase project with the required tables (see [Database Schema](#database-schema))

### Installation

```bash
# Clone the repository
git clone https://github.com/reubenamuzu/habitual.git
cd habitual

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the project root with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run the App

```bash
# Start the development server
npx expo start

# Run on a specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

## Project Structure

```
app/
  (auth)/           # Welcome, sign-in, sign-up screens
  (app)/
    (tabs)/         # Home, Dashboard, Social, Profile tabs
    (modals)/       # Add/edit habit, log mood, friend search
lib/
  auth/             # Authentication service
  db/               # Supabase client & type definitions
  habits/           # Habit CRUD & log toggle services
  mood/             # Mood upsert & query services
  social/           # Friend requests & activity feed
  profile/          # Profile & avatar management
components/
  habits/           # HabitCard, HabitForm, HabitCheckButton
  mood/             # MoodSlider, MoodChart, MoodLogButton
  heatmap/          # HeatmapGrid, HeatmapCell, HeatmapLegend
  stats/            # CompletionRing, StatCard, StreakBadge
  shared/           # PressableScale, ModalSheet, EmptyState
hooks/              # React Query wrappers for all services
constants/
  theme.ts          # Design tokens (colors, typography, spacing)
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User info (username, display name, avatar) |
| `habits` | Habit definitions (name, icon, color, schedule) |
| `habit_logs` | Daily completion records |
| `mood_logs` | Morning/evening mood scores (1-10) |
| `friendships` | Social connections and friend requests |

## Scripts

```bash
npx expo start       # Start dev server
npx expo lint        # Run ESLint
```

## License

This project is private and not licensed for redistribution.
