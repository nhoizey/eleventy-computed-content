module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection('pages', (collection) => {
    return collection.getFilteredByGlob(`pages/**/*.md`).map((page) => {
      page.data.tags.push('new');
      return page;
    });
  });

  eleventyConfig.setDataDeepMerge(true);

  return {};
};
