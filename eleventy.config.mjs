export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.amendLibrary("md", (md) => {
  md.renderer.rules.table_open = () =>
    '<div class="table-wrapper"><table>';

  md.renderer.rules.table_close = () =>
    		  '</table></div>';
});

  eleventyConfig.addFilter("pathSegments", (url) => {
    return url
      .replace(/^\/|\/$/g, "")
      .split("/")
      .filter(Boolean);
  });	
  // Group posts by Year
  eleventyConfig.addCollection("postsByYear", function(collectionApi) {
    const posts = collectionApi.getFilteredByTag("facebook");
    const years = {};
    
    posts.forEach(post => {
      const y = post.data.year;
      if (!y) return;
      if (!years[y]) years[y] = { year: y, posts: [], months: new Set() };
      years[y].posts.push(post);
      if (post.data.month) years[y].months.add(post.data.month);
    });

    // Return sorted array (newest year first)
    return Object.values(years)
      .map(y => ({ ...y, months: Array.from(y.months).sort().reverse() }))
      .sort((a, b) => b.year.localeCompare(a.year));
  });

  // Group posts by Month
  eleventyConfig.addCollection("postsByMonth", function(collectionApi) {
    const posts = collectionApi.getFilteredByTag("facebook");
    const months = {};
    
    posts.forEach(post => {
      if (!post.data.year || !post.data.month) return;
      const key = `${post.data.year}-${post.data.month}`;
      
      if (!months[key]) months[key] = { year: post.data.year, month: post.data.month, posts: [] };
      months[key].posts.push(post);
    });

    // Return sorted array (newest month first)
    return Object.values(months).sort((a, b) => {
      return `${b.year}-${b.month}`.localeCompare(`${a.year}-${a.month}`);
    });
  });
  
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };

}
