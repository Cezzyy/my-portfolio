import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://cez-portfolio.pages.dev',
  integrations: [vue(), mdx()],
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});
