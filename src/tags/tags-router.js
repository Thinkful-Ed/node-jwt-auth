const express = require('express');
const path = require('path');
const TagService = require('./tag-service');

const tagsRouter = express.Router();
const jsonBodyParser = express.json();

/* verbs for general tags */
tagsRouter
  .route('/')

  // get all the tags
  .get((req, res, next) => {
    TagService.getAll(req.app.get('db'))
      .then(tags => {
        res.json(tags);
      })
      .catch(next);
  })

  // add a tag, requires { article_id }
  .post(jsonBodyParser, (req, res, next) => {
    const { text } = req.body;
    const newTag = { text };

    for (const [key, value] of Object.entries(newTag))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    TagService.insertTag(
      req.app.get('db'),
      newTag
    )
      .then(tag => {
        res
          .status(201)
          .location(path.join(req.originalUrl, tag.id))
          .json(tag);
      })
      .catch(next);
  });


/* verbs for soecufuc tag */
tagsRouter
  .route('/:tag_id')

  .all((req, res, next) => {
    TagService.hasTag(
      req.app.get('db'),
      req.params.tag_id
    )
      .then(hasTag => {
        if (!hasTag)
          return res.status(404).json({
            error: { message: 'Tag doesn\'t exist' }
          });
        next();
        return null;
      })
      .catch(next);
  })

  // get the specific tag
  .get((req, res, next) => {
    TagService.getById(
      req.app.get('db'),
      req.params.tag_id
    )
      .then(tag => {
        res.json(tag);
      })
      .catch(next);
  })

  // update tag information, without tags
  .patch(jsonBodyParser, (req, res, next) => {
    const { text } = req.body;
    if (text == null)
      return res.status(400).json({
        error: { message: 'Request body must contain\'text\'' }
      });

    const newFields = {};
    if (text) newFields.text = text;

    TagService.updateTag(
      req.app.get('db'),
      req.params.tag_id,
      newFields
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

  // delete tag if it's not being used by any articles
  .delete((req, res, next) => {
    TagService.getArticleIdsWithTag(
      req.app.get('db'),
      req.params.tag_id
    )
      .then(articleIdsWithTag => {
        if (articleIdsWithTag.length)
          return res.status(400).json({
            error: { message: 'Tag is being used in articles and can\'t be removed' }
          });

        return TagService.deleteTag(
          req.app.get('db'),
          req.params.tag_id
        )
          .then(() => {
            res.status(204).end();
          });
      })
      .catch(next);
  });

module.exports = tagsRouter;
