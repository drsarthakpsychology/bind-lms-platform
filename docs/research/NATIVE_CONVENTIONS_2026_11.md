# Native app prep: iOS and Android conventions (November 2026)

Written 2026-11-14 on branch `agent/eco`. Research only. The native app is a later phase, after the owner approves the web app.

Main sources: Apple Human Interface Guidelines (developer.apple.com/design/human-interface-guidelines), Material Design 3 (m3.material.io), Android 16 behaviour changes (developer.android.com/about/versions/16/behavior-changes-16), Expo docs (docs.expo.dev). Real app references: [../design/REFERENCE_LIBRARY_2026_11.md](../design/REFERENCE_LIBRARY_2026_11.md).

## 1. Conventions that matter for a learning app

| Topic | iOS | Android | What it means for VIBHA |
|---|---|---|---|
| **Main navigation** | Tab bar at the bottom, 3 to 5 tabs, icon plus short label. Tabs keep their own history: tapping Study, then Games, then Study returns you to where you were in Study. | Navigation bar at the bottom, 3 to 5 destinations, icon plus label, active item in a pill. Same idea of separate history per tab. | Our phone bottom nav already matches. Keep 5 or fewer. Keep the scroll position and screen per tab when switching. |
| **Going back** | Swipe from the left edge goes back one screen. A back button with the previous screen's title sits top left. | System back (gesture from either edge, or button). From Android 16, apps targeting API 36 get **predictive back** by default: the user sees the previous screen while dragging, and the old `onBackPressed` is no longer called. | Never block the edge swipe (no horizontal swipe areas touching the screen edge, e.g. card carousels in the reader). Back must always do the obvious thing. In a quiz, ask before leaving only if answers would be lost. |
| **Sheets** | Sheets slide up, have a grabber, stop at medium (half) and large heights, and close by swiping down. | Bottom sheets: standard (stays with content) or modal (dims the page), with a drag handle; swipe down or back closes them. | `MobileBottomSheet` already follows this. Section picker, hints, notes, filters belong in sheets. Back must close the sheet first, not leave the page. |
| **Safe areas and edge to edge** | Content must avoid the notch or Dynamic Island and the home indicator. | From Android 16 (API 36) apps **cannot opt out** of edge to edge. Content draws under the status bar and gesture bar, so insets are required. | We already use `viewport-fit=cover` and safe area padding in `MobilePage`. Keep fixed bottom buttons above the home indicator / gesture bar. |
| **Touch targets** | At least 44 by 44 points. | At least 48 by 48 dp. | Our `min-h-11` (44px) meets iOS. Android wants 48. Use 48 for main actions in the native app. |
| **Type scale** | San Francisco. Body 17pt. Dynamic Type lets users choose from extra small up to 5 accessibility sizes; layouts must reflow. Large Title 34pt for top level screens. | Roboto (or brand font). Material 3 scale: Body Large 16sp, Title Large 22sp, Headline Small 24sp, Display 36 to 57sp. Users can scale font size up to 200% on Android 14 and later. | Students read a lot. Respect the system text size. Test the reader at the largest size. Our web body is 16px; on iOS use 17pt. |
| **Haptics** | Selection feedback for picking, light impact for small actions, success / warning / error notifications. Used sparingly. | `HapticFeedbackConstants` (CONFIRM, REJECT, CLOCK_TICK etc.), also sparing. | Good fits: picking an answer (selection), right answer (success), wrong answer (a light warning, not an "error buzz"), finishing a game. Never on every tap. Respect the system setting. |
| **Motion** | Short, physics based, interruptible. Reduce Motion setting must be honoured. | Material motion: container transforms, shared axis. "Remove animations" setting must be honoured. | We already honour `prefers-reduced-motion`. Keep it. |
| **Dark mode** | System setting, apps follow it. | Same. | We have both themes. Follow the system by default. |
| **Notifications** | Ask permission at a meaningful moment, not on first launch. Time sensitive is a separate level. | Android 13+ needs runtime permission. | Ask after the first finished lesson: "Want a reminder tomorrow?". Only for doubts answered and new lectures. |
| **Offline** | Users expect saved content to work on a train. | Same. | Study notes and finished lessons should read offline in the native app. |

## 2. Cross platform options

| | **PWA** (our web app, installable) | **Capacitor** (web app inside a native shell) | **Expo / React Native** (real native UI) |
|---|---|---|---|
| Licence | n/a | MIT (Ionic) | MIT (Expo, React Native) |
| Cost to build | Free | Free | Free. Expo's cloud build has a free tier with "a limited quantity of low priority builds" a month; Starter plan is $19 a month. Local builds are free. |
| Store fees | None (no store) | Apple $99 a year, Google $25 once | Same as Capacitor |
| What we reuse | Everything | Almost everything: the same Next.js pages, styles and Supabase calls. Needs a static export or a remote URL; server components and server actions need care (they call our Vercel backend). | Logic only: `src/lib` pure code (scoring, FSRS cards, history, hints, content data in `src/content`), Supabase client, Zod schemas. **All screens are rewritten** in React Native components. Tailwind via NativeWind. |
| Native feel | Weakest on iOS (no real tab bar or edge swipe; web push only after "Add to Home Screen", iOS 16.4+) | Medium: web views with native plugins for haptics, push, status bar, safe area. Gestures and sheets are still web. | Best: real native tab bars, sheets, back gestures, Dynamic Type, haptics. Expo Router gives file based routes much like Next.js. |
| Effort | Small: manifest, icons, service worker | Medium | Large |
| Risk | Apple limits | App review may reject an app that is "just a website" (App Store guideline 4.2) | Two UI codebases to keep in step |

## 3. Recommendation for later

1. **Now (cheap, no new codebase):** make the web app a good PWA. There is no web app manifest in `public/` or `src/app/` today. Add a manifest, icons and a small offline page. This also improves the phone web experience the owner is already testing.
2. **Native phase:** **Expo with Expo Router**, sharing a `packages/core` of pure logic and content with the web app. It is the only option that gives the iOS and Android conventions in section 1 for real, and it is free and MIT. Capacitor is the fallback if time is short, but expect App Store push back and web style gestures.
3. **Before starting:** move pure logic that is still mixed with React (for example inside `src/components/study/*` and game pages) into `src/lib` so it can be shared. The official `expo` Claude Code plugin (in the Anthropic marketplace) has skills for this phase.
4. **Design research for native:** use Lazyweb (free) for real iOS app flows. ScreensDesign and Mobbin are paid; ask the owner before buying.
