/**
 * Page motion, all GSAP. Components opt in with data attributes (see reveals.ts for the list),
 * so markup stays readable and there is one place that owns every animation.
 *
 * Everything runs inside gsap.matchMedia: with reduced motion nothing is created, and if the
 * visitor flips the setting mid-visit every tween, ScrollTrigger and SplitText is reverted.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { heroIntro, heroParallax } from './hero';
import { reveals, magnetic } from './reveals';
import { projectStack, projectMocks } from './projects';
import { marquees } from './marquee';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const MOTION = '(prefers-reduced-motion: no-preference)';

// Reading progress under the header. Scroll-linked rather than timed, so it runs for everyone.
const progress = document.querySelector('[data-progress]');
if (progress) {
  gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}

// If the fallback already un-hid the page (GSAP arrived too late), don't hide it again.
if (!root.classList.contains('no-motion')) {
  const mm = gsap.matchMedia();

  mm.add(MOTION, (ctx) => {
    const ac = new AbortController();
    // The hero headline is split into lines, which needs final font metrics. A named ctx.add
    // runs later but still records what it creates, so matchMedia can revert it.
    const intro = ctx.add('heroIntro', () => {
      if (!ac.signal.aborted) heroIntro(ac.signal);
    });
    document.fonts.ready.then(() => intro());
    reveals();
    projectMocks();
    const stopMarquees = marquees();
    return () => {
      ac.abort();
      stopMarquees();
    };
  });

  // Stacking project cards need room: same query as the sticky CSS in ProjectsSection.astro.
  mm.add(`${MOTION} and (min-width: 64rem) and (min-height: 44rem)`, () => {
    projectStack();
  });

  mm.add(`${MOTION} and (pointer: fine)`, () => {
    const ac = new AbortController();
    heroParallax(ac.signal);
    magnetic(ac.signal);
    return () => ac.abort();
  });
}

root.classList.add('motion-ready');
