// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeCartel } from './src/lib/rehype-cartel.js';

export default defineConfig({
  // Surchargés par l’aperçu GitHub Pages (voir .github/workflows/pages.yml)
  site: process.env.SITE_URL ?? 'https://lecartel.art',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    // Notes de bas de page en français, puis mise en page en marge (voir rehype-cartel.js)
    remarkRehype: {
      footnoteLabel: 'Notes',
      footnoteBackLabel: 'Retour au texte',
      clobberPrefix: '',
    },
    rehypePlugins: [rehypeCartel],
    smartypants: false,
  },
});
