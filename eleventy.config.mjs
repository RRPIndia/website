import { RenderPlugin } from "@11ty/eleventy";
import navigationPlugin from "@11ty/eleventy-navigation";

export default function(eleventyConfig) {

  // Plugins
  eleventyConfig.addPlugin(RenderPlugin);
  eleventyConfig.addPlugin(navigationPlugin);

  // Passthrough files
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Markdown table wrapper
  eleventyConfig.amendLibrary("md", (md) => {
    md.renderer.rules.table_open = () =>
      '<div class="table-wrapper"><table>';

    md.renderer.rules.table_close = () =>
      '</table></div>';
  });

  // URL path segments filter
  eleventyConfig.addFilter("pathSegments", (url) => {
    return url
      .replace(/^\/|\/$/g, "")
      .split("/")
      .filter(Boolean);
  });

  // Facebook posts grouped by year
  eleventyConfig.addCollection(
    "postsByYear",
    function(collectionApi) {

      const posts =
        collectionApi.getFilteredByTag("facebook");

      const years = {};

      posts.forEach((post) => {

        const year = post.data.year;

        if (!year) {
          return;
        }

        if (!years[year]) {
          years[year] = {
            year,
            posts: [],
            months: new Set()
          };
        }

        years[year].posts.push(post);

        if (post.data.month) {
          years[year].months.add(post.data.month);
        }
      });

      return Object.values(years)
        .map((yearData) => ({
          ...yearData,
          months: Array.from(yearData.months)
            .sort()
            .reverse()
        }))
        .sort((a, b) =>
          b.year.localeCompare(a.year)
        );
    }
  );

  // Facebook posts grouped by month
  eleventyConfig.addCollection(
    "postsByMonth",
    function(collectionApi) {

      const posts =
        collectionApi.getFilteredByTag("facebook");

      const months = {};

      posts.forEach((post) => {

        const year = post.data.year;
        const month = post.data.month;

        if (!year || !month) {
          return;
        }

        const key = `${year}-${month}`;

        if (!months[key]) {
          months[key] = {
            year,
            month,
            posts: []
          };
        }

        months[key].posts.push(post);
      });

      return Object.values(months)
        .sort((a, b) => {
          const dateA = `${a.year}-${a.month}`;
          const dateB = `${b.year}-${b.month}`;

          return dateB.localeCompare(dateA);
        });
    }
  );

  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
}
