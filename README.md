# MindGuard – Agentic AI Mental Health Companion

MindGuard is an intelligent, adaptive AI system that monitors multi-modal stress signals and delivers personalized interventions using Emotion AI, Reinforcement Learning, and a memory-enabled agent framework.

This project was developed as an academic prototype for stress monitoring and adaptive mental health support.

---

## 1. Problem Statement

Students frequently experience stress due to academic pressure, workload, and emotional factors. However:

- Stress is multi-modal (behavioral, physiological, emotional).
- Existing applications are passive and static.
- Most systems do not adapt or learn from user feedback.
- Personalization is limited.

MindGuard addresses this gap by building an agentic AI system that:

- Observes user behavior  
- Predicts stress levels  
- Decides an appropriate intervention  
- Acts autonomously  
- Learns from feedback over time  

---

## 2. System Architecture

User Interaction  
→ Emotion Signal Collection (Typing / Voice / Text / Sleep)  
→ Stress Prediction Engine  
→ Agent Decision Engine  
→ Intervention Delivery  
→ User Feedback  
→ Reinforcement Learning Update  
→ Memory Storage (Database)

The system is explainable and modular. Each stage can be independently evaluated.

---

## 3. Core Modules

### 3.1 Typing Behavior Module (Behavioral Emotion AI)

File: `useTypingStress.ts`

Metrics captured:
- Typing speed (characters per minute)
- Error rate (backspace usage)
- Pause patterns between keystrokes

Working principle:
- Fast typing combined with high correction rate indicates cognitive overload.
- Long pauses indicate hesitation or anxiety.
- Frequent corrections increase stress score.

Technology:
- JavaScript event listeners
- React hooks
- Real-time behavioral analytics

This implements lightweight Behavioral Emotion AI without external APIs.

---

### 3.2 Voice Emotion Module (Audio-Based Emotion Proxy)

File: `useVoiceStress.ts`

Metrics captured:
- Speaking duration
- Energy proxy (audio amplitude)
- Speaking rate proxy

Working principle:
- High energy + fast speech → agitation
- Low energy → fatigue
- Variation in amplitude influences stress score

Technology:
- MediaRecorder API
- Web Audio API
- Heuristic-based signal analysis

This is a lightweight audio Emotion AI implementation suitable for browser environments.

---

### 3.3 Chat Sentiment Module (Text Emotion AI)

File: `computeChatStress.ts`

Working principle:
- Detects negative emotional keywords.
- Computes a stress score based on sentiment polarity.
- Positive or neutral language reduces stress contribution.

Technology:
- Rule-based sentiment scoring
- LLM-style logic without external API dependency

This ensures safe, offline emotional analysis.

---

### 3.4 Sleep Context Module

File: `SleepEntryForm.tsx`

Data captured:
- Hours slept
- Sleep quality
- Bedtime consistency

Rationale:
Sleep strongly influences long-term stress and cognitive performance. Manual input ensures reliability and correctness.

---

## 4. Stress Fusion Engine

Overall Stress Score:

```
Overall Stress =
35% Typing +
25% Sleep +
25% Voice +
15% Chat
```

Rationale:
- Typing provides continuous behavioral signal.
- Sleep reflects long-term physiological impact.
- Voice reflects situational emotion.
- Chat reflects emotional expression.

The model is explainable and transparent.

---

## 5. Agentic AI Core

Files:
- `agent.ts`
- `AgentContext.tsx`

The system behaves as an autonomous agent:

1. Observes stress score
2. Decides whether intervention is required
3. Selects intervention strategy
4. Delivers intervention
5. Updates learning model based on feedback

Intervention types:
- Breathing exercise
- Grounding technique
- Take a break
- Motivational message
- Focus session
- Reflection prompt

---

## 6. Reinforcement Learning

Files:
- `rlPolicy.ts`
- `applyFeedback()`

Learning mechanism:
- Helpful → +1 reward
- Neutral → 0
- Not helpful → -1

This implements a contextual bandit reinforcement learning model.

Effect:
- Strategies with higher reward are selected more frequently.
- Poor-performing strategies are gradually deprioritized.

---

## 7. Memory-Enabled Agent Framework

The system maintains long-term memory of:

- Past stress readings
- Delivered interventions
- User feedback
- Strategy effectiveness scores

Stored in Supabase tables:
- `stress_readings`
- `sleep_entries`
- `interventions`
- `feedback`
- `strategy_scores`

This enables personalization and adaptive behavior over time.

---

## 8. LLM-Based Motivational Messaging

File: `llmMessages.ts`

The system generates contextual motivational responses based on:
- Current stress level
- Selected intervention type

Design principles:
- Supportive tone
- No medical claims
- Safe language
- Context-aware messaging

---

## 9. Backend Infrastructure – Supabase

Supabase is used for:

- Authentication
- PostgreSQL database
- Secure storage
- Row Level Security
- Real-time updates

Key tables:
- stress_readings
- sleep_entries
- interventions
- feedback
- strategy_scores
- reflections

---

## 10. Insights and Visualization

The Insights dashboard provides:

- Stress trends over time
- Strategy effectiveness analysis
- Learning timeline
- Agent memory summary

This demonstrates:
- Adaptation
- Learning
- System improvement

---

## 11. Technologies Used

Frontend:
- React
- TypeScript
- Vite
- TailwindCSS
- ShadCN UI
- Lucide Icons

State Management:
- React Hooks
- Context API
- TanStack React Query

Backend:
- Supabase
- PostgreSQL

AI Components:
- Behavioral Emotion AI
- Audio Emotion Heuristics
- Text Sentiment Analysis
- Reinforcement Learning (Contextual Bandit)
- Memory Agent Framework

---

## 12. Setup Instructions

1. Install dependencies:

```
npm install
```

2. Configure environment variables:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

3. Run development server:

```
npm run dev
```

---

## 13. Disclaimer

This project is an academic prototype and is not intended to provide medical, psychological, or therapeutic advice.

---

## Authors

Developed as part of an academic AI systems project focusing on adaptive mental health monitoring.
