/**
 * The motion and touch kit. One voice for how everything moves.
 * Full guide with examples: apps/mobile/docs/MOTION.md.
 *
 *   tokens     springs, dur, curves, stagger
 *   press      Press, usePressScale         press feedback (scale; haptic only if asked)
 *   enter      Enter, StaggerList, useEnter, presets, staggerDelay
 *   skeleton   Shimmer, SkeletonIn, Reveal  loading to content
 *   number     RollingNumber                digits roll into place
 *   progress   ProgressRing, ProgressFill, useFill
 *   burst      Burst, Confetti, Stamp       success moments
 *   tabbar     MotionTabBar, tabSceneOptions
 *   stack      stackMotion, modalMotion, fadeMotion
 *   refresh    useRefresh                   pull to refresh
 *   wins       useNewWins                   celebrate each win once
 *   swap       Swap                         keyed content swaps with no blank frame
 *   draw       DrawInk, pathLength          rough.js ink that draws itself on
 *   pixel      PixelBurst                   pixel fireworks for rare wins
 *   mask       MaskLine                     a line of type rising out of a mask
 *   tier       useMotionTier, scaled        low-end Android budget
 *   sprite     Sprite, sprites              small pixel animations (loader, tick, star, flame)
 *   celebrate  useCelebrate, momentBeats    one order for every win
 *
 * Rules: transform and opacity only; worklets on the UI thread; every part
 * checks Reduce Motion and keeps the meaning without the movement.
 */
export * from "./tokens";
export * from "./press";
export * from "./enter";
export * from "./skeleton";
export * from "./number";
export * from "./progress";
export * from "./burst";
export * from "./tabbar";
export * from "./stack";
export * from "./refresh";
export * from "./wins";
export * from "./swap";
export * from "./draw";
export * from "./pixel";
export * from "./mask";
export * from "./tier";
export * from "./sprite";
export * from "./celebrate";
