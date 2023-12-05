import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from "@astrojs/partytown";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://matthewbrown.io',
	integrations: [
    mdx(),
    sitemap(),
    // https://www.kevinzunigacuellar.com/blog/google-analytics-in-astro/
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
