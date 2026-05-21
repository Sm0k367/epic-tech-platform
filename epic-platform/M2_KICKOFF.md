# M2: AI Orchestration Layer — KICKOFF 🚀

**Date:** May 21, 2026  
**Status:** Ready to ship  
**Critical Path:** 2–3 days (parallel work possible)

## Scope

Build the chat-first AI experience. Users will:
1. Navigate to `/dashboard`
2. See a chat interface (GroqChat component)
3. Type creative prompts
4. Get helpful AI responses from Groq
5. Receive suggestions to refine their ideas

## Four Sub-Tickets

### #4 — Dashboard Route with GroqChat Component
**Assignee:** @engineer  
**Effort:** 1 day  
**Blocks:** #5, #6, #7

**What to do:**
1. Create `app/dashboard/page.tsx`
2. Import `<GroqChat />` from `components/groq-chat.tsx` (already built in M1)
3. Style it with cyber-neon theme (dark background, neon borders, glassmorphic cards)
4. Add navigation from landing page to dashboard
5. Verify it renders at `http://localhost:3000/dashboard`

**Acceptance Criteria:**
- [ ] Route renders without errors
- [ ] GroqChat component visible and styled
- [ ] Navigation links work (landing → dashboard, dashboard → home)
- [ ] Mobile responsive
- [ ] Build succeeds (npm run build → exit 0)

---

### #5 — /api/chat Endpoint with Groq Streaming
**Assignee:** @engineer  
**Effort:** 1 day  
**Blocks:** #7

**What to do:**
1. Create `app/api/chat/route.ts`
2. Handle POST requests with JSON body: `{ message: string }`
3. Get GROQ_API_KEY from credential vault
4. Call Groq SDK: `client.chat.completions.create()`
5. Stream response back to client
6. Handle errors gracefully

**Acceptance Criteria:**
- [ ] POST `/api/chat` with `{ message: "hello" }` returns success
- [ ] Response comes from Groq API (not mock)
- [ ] Error handling: test with invalid input, missing key, API errors
- [ ] Streaming works (real-time response, not batched)
- [ ] No TypeScript errors (build succeeds)

**Test Command:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"help me write a cinematic sci-fi opening"}'
```

---

### #6 — Creative Persona System Prompt + Refinement Suggestions
**Assignee:** @engineer  
**Effort:** 1 day  
**Blocks:** #7

**What to do:**
1. Create `lib/groq-prompt.ts` with system prompt
2. System prompt should be: "You are a helpful AI creative advisor for Epic Platform..."
3. Tone: encouraging, collaborative, expert but accessible
4. Behavior: suggest alternative phrasings, ask clarifying questions
5. Wire system prompt into `/api/chat` endpoint
6. Test with sample prompts: verify persona is consistent

**System Prompt Goals:**
- Helpful creative coaching
- Prompt refinement suggestions
- Clarifying questions when ideas are vague
- Encouraging tone (not judgmental)
- Short, punchy responses (encourage iteration)

**Test Prompts (Verify These Work):**
```
"I want to make a video of a robot dancing"
→ Should suggest: mood, duration, style, music, tone

"Make me a cool image"
→ Should ask: what subject? style? mood? color palette?

"Create a cinematic space scene with lots of detail"
→ Should refine: camera angle, lighting, atmosphere, scale
```

**Acceptance Criteria:**
- [ ] System prompt loaded in `lib/groq-prompt.ts`
- [ ] Persona consistent across 5+ test prompts
- [ ] Refinement suggestions appear naturally
- [ ] No TypeScript errors (build succeeds)

---

### #7 — QA Verification for M2 (Dashboard + Chat + Persona)
**Assignee:** @qa  
**Effort:** 0.5 days  
**Blocks:** M3 start  
**Waits For:** #4, #5, #6 complete

**What to verify:**
1. **Dashboard Route**
   - [ ] Loads at `/dashboard` without errors
   - [ ] GroqChat component renders
   - [ ] Layout is cyber-neon styled (dark, neon, glassmorphic)
   - [ ] Mobile responsive

2. **Chat API**
   - [ ] POST `/api/chat` accepts valid requests
   - [ ] Returns Groq responses (not mock)
   - [ ] Error handling works (invalid input, missing credentials)
   - [ ] Responses stream in real-time

3. **Persona & Refinement**
   - [ ] System prompt is present (verified in code)
   - [ ] Responses are helpful and on-brand
   - [ ] Refinement suggestions appear (tested with vague prompts)
   - [ ] Tone is consistent (encouraging, expert, accessible)

4. **Integration**
   - [ ] Dashboard chat works end-to-end (type → API call → response displayed)
   - [ ] Character count displays and updates
   - [ ] No TypeScript errors (build succeeds)
   - [ ] Dev server runs without crashes

**Test Scenarios:**
```
1. User types "create a sci-fi landscape"
   → API called
   → Response with refinement suggestions appears

2. User types empty message
   → Should be rejected or ignored gracefully

3. User types very long prompt (1000+ chars)
   → Character count shows and response is truncated if needed

4. API fails (simulate no GROQ_API_KEY)
   → Error message displayed, app doesn't crash
```

**Acceptance Criteria:**
- [ ] All M2 sub-tickets' ACs verified
- [ ] Dashboard renders without errors
- [ ] Chat works end-to-end (type → Groq → response)
- [ ] Persona quality verified (subjective: helpful, creative, on-brand)
- [ ] No regressions (M1 landing page still works, build passes)
- [ ] Mobile responsive

---

## Critical Paths & Dependencies

```
┌─────────────────────────┐
│ M1 Complete (Done)      │
│ GroqChat stub ready     │
│ GROQ_API_KEY available  │
└────────────┬────────────┘
             │
    ┌────────┴────────┬──────────────┬──────────────┐
    │                 │              │              │
    v                 v              v              v
┌────────────┐ ┌─────────────┐ ┌──────────────┐ ┌──────────────┐
│ #4: Route  │ │ #5: Endpoint│ │ #6: Persona  │ │ (Parallel)   │
│ Dashboard  │ │ API + Stream│ │ + Refinement │ │              │
│ 1 day      │ │ 1 day       │ │ 1 day        │ │              │
└────────────┘ └─────────────┘ └──────────────┘ └──────────────┘
    │                 │              │              │
    └─────────────────┴──────────────┴──────────────┘
                      │
                      v
              ┌──────────────────┐
              │ #7: QA Gate      │
              │ Verification     │
              │ 0.5 days         │
              └────────┬─────────┘
                       │
                       v
            ┌─────────────────────┐
            │ M2 Complete ✅      │
            │ → Start M3          │
            └─────────────────────┘
```

**Total Duration:** 2–3 days (with parallelization)

---

## Getting Started (For @engineer)

### Prerequisites
- [ ] Familiar with Next.js App Router
- [ ] Can use Groq SDK (see M1 examples: `lib/groq-client.ts`)
- [ ] Can use `credential_get()` for API keys (see M1 tests)
- [ ] Can use Vercel AI SDK or manual streaming

### Quick Start
```bash
cd /workspace/epic-platform

# Make sure build works
npm run build
# → Should be ~5.4s, exit 0

# Start dev server
npm run dev
# → http://localhost:3000

# Verify M1 is ready
curl http://localhost:3000/api/test-groq
# → Should return success + Groq response
```

### File Structure (After M2)
```
app/
├── page.tsx              # Landing page (M1)
├── dashboard/
│   └── page.tsx          # New: Dashboard (M2.1)
├── api/
│   ├── test-groq/
│   │   └── route.ts      # M1 test endpoint
│   └── chat/
│       └── route.ts      # New: Chat endpoint (M2.2)
lib/
├── groq-client.ts        # M1 client
├── groq-prompt.ts        # New: System prompt (M2.3)
└── utils.ts
components/
├── groq-chat.tsx         # M1 component (wire into M2.1)
└── ui/                   # shadcn components
```

### Key Resources
- **M1 Groq Example:** `lib/groq-client.ts` + `app/api/test-groq/route.ts`
- **M1 Component:** `components/groq-chat.tsx` (stub ready to wire)
- **System Prompt Inspiration:** Craft a helpful, creative tone (see M2.3 details)
- **Streaming:** Use Vercel AI SDK or manual EventStream

---

## Success Criteria (For This Milestone)

### For @engineer (#4, #5, #6)
- ✅ Dashboard route created and wired
- ✅ Chat API endpoint works (accepts requests, returns Groq responses)
- ✅ System prompt implemented and verified
- ✅ No TypeScript errors
- ✅ Commits pushed to main branch

### For @qa (#7)
- ✅ All ACs from #4, #5, #6 verified
- ✅ Dashboard renders without errors
- ✅ Chat works end-to-end
- ✅ Persona quality verified
- ✅ No regressions
- ✅ Sign-off: "M2 complete ✅ Ready for M3"

---

## Rollout Plan

1. **Now (2026-05-21):** Assign tickets, kick off work
2. **Day 1 (May 21):** #4, #5, #6 in progress (parallel work)
3. **Day 2 (May 22):** #4, #5, #6 completed, PR review
4. **Day 3 (May 23):** #7 QA verification, sign-off
5. **Post-M2:** M3 decomposition (Backend + Auth + Memory)

---

## Team, Let's Ship 🚀

M1 was solid. M2 is straightforward: dashboard + API + persona. You've got the foundation (Groq client, GroqChat component, credentials). Go make the chat experience exceptional.

Questions? Blockers? Tag @tech-lead or @project-manager.

**Target:** M2 complete by EOD May 23. Then full steam into M3 (Backend Services).

---

*Generated: 2026-05-21*  
*Prepared by: @tech-lead*  
*Ready: Yes ✅*
