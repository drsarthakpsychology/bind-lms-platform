# To connect: Learn area (builder "blearn")

Screens in the Learn area that are designed with sample data, and what each one needs from the server.
Each sample lives in one `mock.ts` beside the screen and starts with the line `// MOCK DATA: design phase only.`

| Screen | File | What is sample | What it needs | Where the website has it |
|---|---|---|---|---|
| Lecture page, Chapters tab | `src/screens/lecture/lecture.tsx`, sample in `src/screens/lecture/mock.ts` (`mockChapters`) | The list of parts of the lecture and their start times. Tapping one already jumps the real video. | `chapters: { at: number /* seconds */; title: string }[]` on `GET /lectures/:lessonId` (`LectureDetail`). | Not on the website yet. Lessons have only a description (`src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/page.tsx`). |
| Lecture page, My notes tab | same files (`MOCK_NOTES`) | Your own notes on a lecture, each pinned to a time. New notes stay only until you leave the lecture. | A per-student store: `GET /lectures/:lessonId/notes`, `PUT` to add or change one (`{ at, text }`). The study-section notes (`/study/marks`) are the model to copy. | Not on the website. Section notes are in `src/app/api/app/v1/study/marks/route.ts`. |

Kit wish noted for the foundation builder: the route `assignment/[lessonId]` (new, the assignment's own page) is not listed in `app/_layout.tsx`, so it opens with the default push. Add it with `growOr` like `lecture/[lessonId]` so the stones that open it grow into it.
