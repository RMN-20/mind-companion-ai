

# MindGuard AI – Autonomous Mental Health Companion

## Overview
A research-grade, agentic mental health support system that autonomously senses, predicts, and acts on user stress signals — without requiring the user to ask for help. Built with Lovable Cloud (Supabase) for persistent data, real-time AI (Lovable AI), and a calming, emotionally safe design.

---

## Design System
- **Palette**: Soft lavender, muted sky blue, off-white, pale sand with light gradients
- **Tone**: Calm, reassuring, modern — emotionally safe, not clinical
- **Typography**: Clean, rounded, readable fonts
- **No dark theme, no neon, no harsh contrast**

---

## Pages & Features

### 1. Landing / Login Page
- Calm hero section explaining MindGuard's autonomous support concept
- "Your silent mental health companion — always watching, never judging"
- Sign up / Sign in with email authentication via Supabase Auth
- Non-diagnostic disclaimer visible on entry

### 2. Dashboard — Live Monitoring Center
- **Status banner**: "Monitoring Active" with a soft pulsing indicator
- **Three live signal cards**:
  - **Typing Stress**: Shows current typing speed, error rate, pause patterns — computed client-side as user types in the app. Displayed as a real-time mini trend chart
  - **Voice Stress**: Shows last analyzed voice note emotion (calm, tense, fatigued). Upload or record a short voice note — transcribed and sentiment-analyzed via AI
  - **Sleep Quality**: Shows most recent sleep data (hours, quality, consistency) entered via sliders/form
- **Overall Stress Gauge**: A fusion score combining all three signals, displayed as a calm radial or bar indicator
- **Recent Autonomous Actions**: A timeline of what the AI has done recently (sent a breathing exercise, motivational nudge, break reminder)

### 3. AI Companion — Autonomous Support Hub
- **No "start chat" button** — the system proactively shows interventions
- **Current Intervention Panel**: Shows the AI's current recommendation (breathing exercise with animated guide, grounding technique with step-by-step UI, or break suggestion with timer)
- **Motivational Messages**: Real-time LLM-generated supportive messages via Lovable AI, adapted to the user's current stress context
- **Multi-Option Feedback System** (on every intervention):
  - 👍 Helpful
  - 👎 Not helpful
  - ✅ I acknowledge this
  - ⏳ Remind me later
  - 🔁 I tried this
- **Optional Reflection Input**: A journaling textarea labeled "Reflection" — analyzed for sentiment but never required
- Feedback is stored and used to influence future intervention selection

### 4. Insights & Learning Page
- **Stress Trends**: Line/area charts showing typing stress, voice stress, sleep quality, and overall stress over days/weeks
- **Strategy Effectiveness**: Visual breakdown of which interventions received positive vs. negative feedback
- **Learning Timeline**: Shows how the AI has adapted — e.g., "Week 1: Suggested breathing exercises → Week 3: Shifted to grounding techniques based on your feedback"
- **Memory Visualization**: A summary of what the agent "remembers" — past patterns, preferred interventions, response history

### 5. Privacy & Ethics Page
- Opt-in transparency: explains what data is collected and why
- Data safety assurances
- User control: ability to clear history, pause monitoring, opt out
- Clear non-diagnostic disclaimer: "This system is supportive, not diagnostic. It does not replace professional care."

---

## Backend Architecture (Lovable Cloud / Supabase)

### Database Tables
- **profiles**: User settings, preferences, monitoring opt-in status
- **stress_readings**: Timestamped records of typing, voice, and sleep stress scores
- **sleep_entries**: Manual sleep data (hours, quality, bedtime)
- **interventions**: Log of every autonomous action taken (type, content, timestamp)
- **feedback**: User feedback on each intervention (with the 5-option reward signal)
- **reflections**: Optional journal entries with AI-analyzed sentiment
- **strategy_scores**: Tracks effectiveness of each intervention type per user (drives adaptive behavior)

### Edge Functions
- **ai-companion**: Generates personalized motivational messages and intervention recommendations using Lovable AI (Gemini), informed by current stress data and past feedback
- **analyze-voice**: Accepts voice note audio, transcribes it, and analyzes emotional tone via Lovable AI
- **analyze-sentiment**: Analyzes reflection text for emotional sentiment
- **predict-stress**: Computes overall stress fusion score from typing, voice, and sleep signals

---

## Agentic Behavior (How Autonomy Works)

1. **Sensing**: Typing behavior is monitored passively in-app; sleep is logged; voice is analyzed on submission
2. **Predicting**: Each signal generates a stress sub-score; these fuse into an overall score stored in the database
3. **Acting**: When stress exceeds thresholds, the system autonomously generates and displays an intervention (no user request needed)
4. **Feedback**: Every intervention includes the 5-option feedback widget
5. **Learning**: Feedback adjusts strategy weights — interventions that get "Helpful" or "I tried this" are prioritized; "Not helpful" ones are deprioritized over time. This is visible on the Insights page.

---

## Key Interactions
- Typing in any text field in the app passively feeds the typing stress sensor
- Recording a voice note triggers voice emotion analysis
- Logging sleep via sliders updates the sleep signal
- The dashboard updates stress scores automatically
- Interventions appear proactively on the companion page
- Feedback on interventions drives what the AI suggests next

