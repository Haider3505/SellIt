const router = require("express").Router();

const algoliaSearch = require("algoliasearch");

const client = algoliaSearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SECRET_KEY
);

// mongoose-algolia: to sync the data with algolia
// algoliasearch: to search,save,update,delete the data with algolia

const index = client.initIndex(process.env.ALGOLIA_INDEX);

router.post("/search", async (req, res) => {
  try {
    const result = await index.search(req.body.title);
    // const result = await index.search(req.body.query);
    res.json(result.hits);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
