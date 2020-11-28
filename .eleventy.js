function mergeAndSortTags(tags1, tags2) {
  let tagsAll = [
    ...new Set(
      [].concat(
        ...tags1,
        ...tags2
      )
    ),
  ];
  tagsAll.sort((a, b) => {
    return a.localeCompare(b, 'en', { ignorePunctuation: true });
  });
  return tagsAll;
}

module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection('pages', (collection) => {
    return collection.getFilteredByGlob(`pages/**/*.md`).map((page) => {
      const hashtags = page.template.frontMatter.content.match(/#[a-z0-9]+/g).map((hashtag) => hashtag.slice(1));
      page.data.tags = mergeAndSortTags(page.data.tags, hashtags);
      return page;
    });
  });

  // eleventyConfig.setDataDeepMerge(true);

  return {};
};
