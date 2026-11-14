/**
 * Hero intro and pointer parallax.
 *
 *   data-hero            the hero section
 *   data-intro           hidden until the intro reveals it (see global.css)
 *   data-hero-title      headline; its words rise line by line
 *   data-hero-fade       fades and rises after the headline
 *   data-swash           marigold underline path, drawn in
 *   data-count           number that counts up from zero
 *   data-hero-slab       marigold slab behind the portrait
 *   data-hero-portrait   portrait frame, wiped in from the bottom
 *   data-hero-pop        stickers that pop in around the portrait, then bob
 *   data-spin            badge ring that turns slowly, faster on hover
 *   data-depth           layer that drifts with the pointer (value = depth)
 */
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export function heroIntro(signal: AbortSignal) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const q = gsap.utils.selector(hero);
  const [title] = q('[data-hero-title]');

  const split = SplitText.create(title, { type: 'lines,words', mask: 'lines', linesClass: 'split-line' });
  gsap.set(q('[data-intro]'), { visibility: 'visible' });
  // Keep the swash undrawn while the words rise. Set after splitting so the HTML that
  // revert() restores stays untouched (fully drawn) if motion is switched off.
  gsap.set(q('[data-swash]'), { strokeDashoffset: 1 });

  // Stickers bob once they've landed; created now so matchMedia can revert them.
  const bob = gsap.to(q('[data-hero-pop]'), {
    y: (i) => (i % 2 ? 7 : -7),
    duration: (i) => 2.4 + i * 0.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    paused: true,
  });

  const counters = q('[data-count]').map((el) => {
    const end = Number(el.textContent);
    const counter = { value: 0 };
    el.textContent = '0';
    return gsap.to(counter, {
      value: end,
      duration: 1.4,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => (el.textContent = String(Math.round(counter.value))),
    });
  });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
  tl.from(q('[data-hero-kicker]'), { y: 16, opacity: 0, duration: 0.7 })
    .from(split.words, { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.055 }, 0.12)
    // Unsplit once the words land, so the line masks can't clip the swash or resize badly.
    // revert() rebuilds the headline's HTML, so the swash path has to be looked up again here;
    // a tween aimed at the old path would animate a detached node.
    .call(() => {
      split.revert();
      gsap.fromTo(
        title.querySelector('[data-swash]'),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' },
      );
    })
    .from(q('[data-hero-fade]'), { y: 24, opacity: 0, stagger: 0.09 }, 0.6)
    .add(() => counters.forEach((c) => c.play()), 0.9)

    .from(q('[data-hero-slab]'), { rotation: -14, scale: 0.85, opacity: 0, duration: 1.3, ease: 'expo.out' }, 0.25)
    .fromTo(
      q('[data-hero-portrait]'),
      { clipPath: 'inset(100% 0% 0% 0% round 2rem)' },
      { clipPath: 'inset(0% 0% 0% 0% round 2rem)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' },
      0.15,
    )
    .from(q('[data-hero-portrait] img'), { scale: 1.35, duration: 1.8, ease: 'expo.out' }, 0.55)
    .from(
      q('[data-hero-pop]'),
      {
        opacity: 0,
        scale: 0.3,
        rotation: (i) => [-24, 18, -14][i % 3],
        duration: 0.85,
        ease: 'back.out(1.8)',
        stagger: 0.13,
      },
      1,
    )
    .add(() => bob.play());

  // The badge ring turns forever; hovering the badge spins it up.
  const spin = gsap.to(q('[data-spin]'), { rotation: 360, duration: 18, ease: 'none', repeat: -1 });
  q('[data-spin]').forEach((ring) => {
    const badge = ring.closest('a');
    badge?.addEventListener('pointerenter', () => gsap.to(spin, { timeScale: 5, duration: 0.5 }), { signal });
    badge?.addEventListener('pointerleave', () => gsap.to(spin, { timeScale: 1, duration: 0.8 }), { signal });
  });

  // As the hero scrolls away, the stage drifts up slower than the page, the copy a touch faster.
  const scrollAway = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  gsap.to(q('[data-hero-stage]'), { yPercent: -10, ease: 'none', scrollTrigger: scrollAway });
  gsap.to(q('[data-hero-copy]'), { yPercent: -6, opacity: 0.2, ease: 'none', scrollTrigger: { ...scrollAway } });
}

export function heroParallax(signal: AbortSignal) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', hero).map((el) => ({
    depth: Number(el.dataset.depth) || 0.2,
    x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
  }));

  hero.addEventListener(
    'pointermove',
    (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      for (const layer of layers) {
        layer.x(nx * layer.depth * 60);
        layer.y(ny * layer.depth * 60);
      }
    },
    { signal },
  );
  hero.addEventListener(
    'pointerleave',
    () => {
      for (const layer of layers) {
        layer.x(0);
        layer.y(0);
      }
    },
    { signal },
  );
}
