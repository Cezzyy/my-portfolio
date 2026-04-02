import type { Config } from 'tailwindcss';

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        elegant: {
          black: "#0a0a0a",
          "dark-gray": "#1a1a1a",
          "medium-gray": "#2a2a2a",
          "light-gray": "#3a3a3a",
          "soft-gray": "#6a6a6a",
          "pale-gray": "#9a9a9a",
          "off-white": "#e5e5e5",
          white: "#ffffff",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} satisfies Config;
