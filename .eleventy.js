function mergeAndSortTags(tags1, tags2) {
  // Using Set removes duplicates
  let tagsAll = [...new Set([].concat(...tags1, ...tags2))];
  tagsAll.sort((a, b) => {
    return a.localeCompare(b, 'en', { ignorePunctuation: true });
  });
  return tagsAll;
}

function addTagsCollections(eleventyConfig, collection, tagsCollections) {
  for (let tag of Object.keys(tagsCollections)) {
    console.log(tag);
    eleventyConfig.addCollection(`tag ${tag}`, collection => {
      return collection.getAll().filter(page => {
        const hashtags = page.template.frontMatter.content
          .match(/#[a-z0-9]+/g)
          .map(hashtag => hashtag.slice(1));
        page.data.tags = mergeAndSortTags(page.data.tags, hashtags);
        return page.data.tags.includes(tag);
      });
    });
  }
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection('pages', collection => {
    return collection.getFilteredByGlob(`pages/**/*.md`).map(page => {
      const hashtags = page.template.frontMatter.content
        .match(/#[a-z0-9]+/g)
        .map(hashtag => hashtag.slice(1));
      page.data.tags = mergeAndSortTags(page.data.tags, hashtags);
      return page;
    });
  });

  eleventyConfig.addCollection('tags', collection => {
    let tagsCollections = {};
    let all = collection.getAll();
    let allWithHashtags = all.map(page => {
      const hashtags = page.template.frontMatter.content
        .match(/#[a-z0-9]+/g)
        .map(hashtag => hashtag.slice(1));
      page.data.tags = mergeAndSortTags(page.data.tags, hashtags);

      page.data.tags.forEach(tag => {
        if (tagsCollections[tag] === undefined) {
          tagsCollections[tag] = [];
        }
        tagsCollections[tag].push(page);
      });

      return page;
    });

    addTagsCollections(eleventyConfig, collection, tagsCollections);

    return allWithHashtags;
  });

  return {};
};
