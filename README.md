# STUDYHUB AI — Personal Smart Study Management System
### Academic Productivity Platform for B.Tech Students

STUDYHUB AI is a comprehensive, production-grade academic productivity and study management platform designed specifically for undergraduate engineering (B.Tech) students to manage subjects, 5 syllabus units per subject, exam countdowns, notes, study schedules, spaced repetitions, backlogs, and academic performance.

---

## 🌟 Key Features

1. **Academic Dashboard**:
   - Total Subjects (8 initial B.Tech courses preloaded: BDA, HRPM, SADP, DMGT, IoT, DE, ES, ADS).
   - Total Units (40 units total, with 5 units per subject).
   - Live completion meters for completed vs pending units.
   - Today's logged study hours vs daily target.
   - Next upcoming examination countdown banner.
   - Morning, Afternoon, and Night study checklists.

2. **Subject & 5-Unit Management**:
   - Full CRUD: Add, edit, and delete subjects.
   - Strictly 5 units auto-scaffolded per subject.
   - Add topics under each unit with "Important" star tags.
   - Unit-level and topic-level completion checkboxes.
   - Priority settings (High, Medium, Low) and examination dates.

3. **Smart Study Planner**:
   - Morning (06:00 - 12:00), Afternoon (12:00 - 18:00), and Night (18:00 - 00:00) sessions.
   - Daily task checklist with instant completion toggling.
   - Automatic overdue task detection with one-click "Reschedule to Today/Tomorrow".

4. **Gemini AI Academic Tutor**:
   - Select Subject -> Select Unit (1 to 5) -> Select Topic.
   - **7-Mark University Exam Answers**: Structured with Overview, ASCII/Mermaid Architecture Diagram, Mechanism, Advantages/Limitations table, and Applications.
   - **Simple English (ELI5)**: Intuitive real-world analogies.
   - **High-Yield Short Notes**: Formulas, bullet points, and common exam mistakes.
   - **Interactive Practice MCQs**: Real-time quiz evaluation, score tracking, and confetti celebrations.
   - **Important Questions**: Top 5 frequently asked 2-mark and 7-mark university questions.
   - Ground truth study material input to avoid syllabus hallucinations.

5. **Curriculum Notes Manager**:
   - Subject-wise and Unit-wise (Units 1 to 5) organization.
   - Live Markdown editor with real-time editing.
   - Search & keyword filtering.
   - One-click export to Markdown (`.md`).

6. **Exam Preparation Command Center**:
   - Live digital flip countdowns (Days, Hours, Minutes, Seconds).
   - 5-Unit Syllabus Readiness Index.
   - Previous Year Question Papers (PYQs) bank.

7. **Spaced Repetition Engine (1-7-30 Days)**:
   - Scientifically proven retention intervals:
     - Review 1: +1 Day
     - Review 2: +7 Days
     - Review 3: +30 Days
   - Automated overdue indicators and completion tracking.

8. **University Backlog Clearance Tracker**:
   - Dedicated tracker for supplementary subjects: Semester, Attempt number, Exam date, and Result status (Pending, Cleared, Failed).
   - 3-step clearance checklist (Syllabus Covered, PYQs Solved, Revisions Done).

9. **Readiness & Productivity Analytics**:
   - Subject-wise syllabus completion comparison bars.
   - Total study hours distribution.
   - Revision adherence rates.
   - Weighted Exam Readiness Score.

10. **Focus Study Timer & Pomodoro**:
    - Digital stopwatch/timer with Pause, Resume, and Reset.
    - Saves focus minutes directly into analytics under specific subjects and time slots.

11. **Accidental Data Loss Prevention**:
    - Confirmation shields before deleting subjects, units, notes, or backlogs.
    - Automated continuous shadow backup in local storage.
    - One-click JSON backup export and import.

---

## 🚀 Running the Project

### Development Server:
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173`**

### Production Build:
```bash
npm run build
npm run preview
```

---

## 🗄️ Supabase PostgreSQL Setup (Optional Cloud Sync)

If you wish to sync data across devices using Supabase, run the SQL script located in:
`supabase_schema.sql` (or see the database schema section) in your Supabase SQL Editor.

Set the following environment variables in a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

*Note: The application automatically functions out-of-the-box with reactive local storage persistence even without Supabase!*
