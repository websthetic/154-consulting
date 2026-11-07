// ─────────────────────────────────────────────────────────────────────────────
// ELEVENTY CONFIGURATION
// This file configures how Eleventy builds your static site
// Documentation: https://www.11ty.dev/docs/config/
// ─────────────────────────────────────────────────────────────────────────────

// 📦 Plugin Imports
const pluginImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const pluginMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");

// ⚙️ Configuration Files
const configSitemap = require("./src/config/plugins/sitemap");
const configImages = require("./src/config/plugins/images");

// 🔧 Processing Functions
const less = require("./src/config/processors/less");
const javascript = require("./src/config/processors/javascript");

// 🛠️ Utilities
const filterPostDate = require("./src/config/filters/postDate");
const filterIsoDate = require("./src/config/filters/isoDate");
const caseStory = require("./src/config/shortcodes/caseStory");
const isProduction = process.env.ELEVENTY_ENV === "PROD";

module.exports = function (eleventyConfig) {
    // ═════════════════════════════════════════════════════════════════════════
    // LANGUAGES
    // Using Eleventy's build events to process non-template languages
    // Learn more: https://www.11ty.dev/docs/events/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * JavaScript & CSS Processing
     * These processors handle bundling, transpiling, and minification
     * - JavaScript: Compiled with esbuild for modern bundling
     * - CSS/LESS: Processed and minified for production, including a PostCSS pipeline
     */
    eleventyConfig.on("eleventy.after", javascript);
    eleventyConfig.on("eleventy.after", less);

    // ═════════════════════════════════════════════════════════════════════════
    // PLUGINS
    // Extend Eleventy with additional functionality
    // Learn more: https://www.11ty.dev/docs/plugins/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * 🖼️ Image Optimization
     * Resize and optimize images for better performance using {% getUrl %}
     * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-sharp-images
     */
    eleventyConfig.addPlugin(pluginImages, configImages);

    /*
     * 🗺️ Sitemap Generation
     * Creates sitemap.xml automatically using domain from _data/client.json
     * Documentation: https://github.com/quasibit/eleventy-plugin-sitemap
     */
    eleventyConfig.addPlugin(pluginSitemap, configSitemap);

    /*
     * 📦 Production Minification
     * Minifies HTML, CSS, JSON, XML, XSL, and webmanifest files
     * Only runs during production builds (npm run build)
     * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-minify
     */
    if (isProduction) {
        eleventyConfig.addPlugin(pluginMinifier);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // PASSTHROUGH COPIES
    // Copy files directly to output without processing
    // Learn more: https://www.11ty.dev/docs/copy/
    // ═════════════════════════════════════════════════════════════════════════

    eleventyConfig.addPassthroughCopy("./src/assets/images"); // Images (CSS and JS are compiled separately)
    eleventyConfig.addPassthroughCopy("./src/assets/favicons"); // Favicons and manifest
    eleventyConfig.addPassthroughCopy("./src/_redirects"); // Redirect rules

    // ═════════════════════════════════════════════════════════════════════════
    // FILTERS
    // Transform data in templates at build time
    // Learn more: https://www.11ty.dev/docs/filters/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * 📅 Human-Readable Date Formatting Filter
     * Converts JavaScript dates to human-readable format
     * Usage: {{ "2023-12-02" | postDate }}
     * Powered by Luxon: https://moment.github.io/luxon/api-docs/
     */
    eleventyConfig.addFilter("postDate", filterPostDate);

    /*
     * 📅 ISO Date Formatting Filter
     * Converts JavaScript dates to ISO 8601 format
     * Usage: {{ "2023-12-02" | isoDate }}
     * Powered by Luxon: https://moment.github.io/luxon/api-docs/
     */
    eleventyConfig.addFilter("isoDate", filterIsoDate);

    /*
     * ⬅️➡️ Previous and next in a collection, wrapping at either end
     * Usage: {% set n = collections.cases | neighbours(page.url) %}
     */
    eleventyConfig.addFilter("neighbours", (list, url) => {
        const i = list.findIndex((p) => p.url === url);
        return { prev: list[(i - 1 + list.length) % list.length], next: list[(i + 1) % list.length] };
    });

    /*
     * 🔎 First item in a collection whose data matches
     * Usage: {% set parent = collections.pillars | findBy("key", pillar) %}
     */
    eleventyConfig.addFilter("findBy", (list, key, value) => list.find((p) => p.data[key] === value));

    // ═════════════════════════════════════════════════════════════════════════
    // COLLECTIONS
    // Case studies and services, in the order set by each file's `order`
    // ═════════════════════════════════════════════════════════════════════════

    const byOrder = (a, b) => a.data.order - b.data.order;
    eleventyConfig.addCollection("cases", (api) => api.getFilteredByGlob("./src/work/*.md").sort(byOrder));
    eleventyConfig.addCollection("pillars", (api) =>
        api.getFilteredByGlob("./src/services/*.md").filter((p) => p.data.kind === "pillar").sort(byOrder)
    );
    eleventyConfig.addCollection("services", (api) =>
        api.getFilteredByGlob("./src/services/*.md").filter((p) => p.data.kind === "service").sort(byOrder)
    );

    // Every page uses the base layout unless it says otherwise
    eleventyConfig.addGlobalData("layout", "layouts/base.html");

    // ═════════════════════════════════════════════════════════════════════════
    // SHORTCODES
    // Generate dynamic content with JavaScript
    // Learn more: https://www.11ty.dev/docs/shortcodes/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * 📆 Current Year Shortcode
     * Outputs the current year (useful for copyright notices)
     * Usage: {% year %}
     * Updates automatically with each build
     */
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    /*
     * 🖋️ Case study scene: the mark set out, traced, filled, then shown in its system
     * Usage: {% caseStory key, name, palette, story, marks %}
     */
    eleventyConfig.addShortcode("caseStory", caseStory);

    // ═════════════════════════════════════════════════════════════════════════
    // BUILD CONFIGURATION
    // Define input/output directories and template engine
    // ═════════════════════════════════════════════════════════════════════════

    return {
        dir: {
            input: "src", // Source files directory
            output: "public", // Build output directory
            includes: "_includes", // Partial templates directory
            data: "_data", // Global data files directory
        },
        htmlTemplateEngine: "njk", // Nunjucks for HTML templates
    };
};
