import type { SimpleIcon } from 'simple-icons';
import {
  siFlutter, siDart, siExpo, siVuedotjs, siNuxt, siReact, siAstro, siTypescript, siJavascript,
  siHono, siBun, siGo, siDotnet, siPostgresql, siSupabase, siFirebase, siDrizzle,
  siTurborepo, siPnpm, siCloudflare, siGit, siJira, siGithub, siFacebook, siInstagram,
  siEspressif, siPython,
} from 'simple-icons';

/** A brand glyph: a single SVG path on a 24×24 grid. */
export interface Glyph {
  title: string;
  path: string;
}

// simple-icons dropped LinkedIn at the brand's request, so its mark lives here.
const linkedin: Glyph = {
  title: 'LinkedIn',
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

const glyphs: Record<string, SimpleIcon | Glyph> = {
  'Flutter': siFlutter,
  'Dart': siDart,
  'Expo': siExpo,
  'Vue.js': siVuedotjs,
  'Vue': siVuedotjs,
  'Nuxt': siNuxt,
  'React': siReact,
  'React Native': siReact,
  'Astro': siAstro,
  'TypeScript': siTypescript,
  'JavaScript': siJavascript,
  'Hono': siHono,
  'Bun': siBun,
  'Go': siGo,
  // simple-icons has no C# mark; the .NET mark covers both C# and ASP.NET Core.
  'C#': siDotnet,
  'ASP.NET Core': siDotnet,
  'PostgreSQL': siPostgresql,
  'Supabase': siSupabase,
  'Firebase': siFirebase,
  'Drizzle': siDrizzle,
  'Turborepo': siTurborepo,
  'pnpm': siPnpm,
  'Cloudflare': siCloudflare,
  'Git': siGit,
  'Jira': siJira,
  'ESP32': siEspressif,
  'Python': siPython,
  'GitHub': siGithub,
  'LinkedIn': linkedin,
  'Facebook': siFacebook,
  'Instagram': siInstagram,
};

export const glyphFor = (name: string): Glyph | null => glyphs[name] ?? null;

/** Escape HTML, then turn `**bold**` into <strong>. For short trusted strings from content. */
export const inlineBold = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ink">$1</strong>');
