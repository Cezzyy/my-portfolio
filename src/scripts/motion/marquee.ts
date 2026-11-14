/**
 * Endless marquees that react to scrolling: they follow the scroll direction and speed up with
 * scroll velocity, then ease back to a cruise.
 *
 *   data-marquee            a track holding its content twice, side by side
 *   data-marquee="reverse"  runs the other way
 *
 * Driven from the ticker rather than a repeating tween so the direction can flip cleanly.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Percent of the track (two copies) moved per millisecond at cruise speed: one copy in ~45s.
const CRUISE = 50 / 45_000;

export function marquees(): () => void {
  const tracks = gsap.utils.toArray<HTMLElement>('[data-marquee]').map((el) => ({
    dir: el.dataset.marquee === 'reverse' ? -1 : 1,
    x: el.dataset.marquee === 'reverse' ? -50 : 0,
    set: gsap.quickSetter(el, 'xPercent') as (value: number) => void,
    el,
  }));
  if (tracks.length === 0) return () => {};

  const wrap = gsap.utils.wrap(-50, 0);
  const state = { speed: 1, heading: 1, visible: false };

  const tick = (_time: number, deltaTime: number) => {
    if (!state.visible) return;
    for (const track of tracks) {
      track.x = wrap(track.x - track.dir * state.heading * state.speed * CRUISE * deltaTime);
      track.set(track.x);
    }
  };
  gsap.ticker.add(tick);

  const area = tracks[0].el.closest('section') ?? tracks[0].el;
  ScrollTrigger.create({
    trigger: area,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (state.visible = self.isActive),
    onUpdate: (self) => {
      state.heading = self.direction;
      const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 350);
      gsap.to(state, { speed: boost, duration: 0.25, overwrite: true });
      gsap.to(state, { speed: 1, duration: 1.2, delay: 0.25, ease: 'power2.out' });
    },
  });

  return () => {
    gsap.ticker.remove(tick);
    gsap.killTweensOf(state);
    gsap.set(tracks.map((t) => t.el), { clearProps: 'transform' });
  };
}
