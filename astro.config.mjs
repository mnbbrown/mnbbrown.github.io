import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://matthewbrown.io",
  trailingSlash: "never",
  integrations: [
    mdx(),
    sitemap({
      // Exclude resume page from sitemap
      filter: (page) => !page.includes("/resume/"),
    }),
    // https://www.kevinzunigacuellar.com/blog/google-analytics-in-astro/
    partytown({
      config: {
        forward: ["dataLayer.push"],
        // Add debug: false for production to reduce file size
        debug: false,
        // Add a custom file name to reduce chance of being crawled
        lib: "~partytown-files/",
      },
    }),
  ],
});
