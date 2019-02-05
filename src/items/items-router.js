const xss = require('xss');
const path = require('path');
const express = require('express');
const createError = require('http-errors');

const ItemService = require('./items-service');

const itemsRouter = express.Router();
const jsonBodyParser = express.json();

const serialize = item => ({
  id: item.id,
  name: xss(item.name),
  description: xss(item.description),
  date_published: item.date_published,
  author_id: item.author_id
});

itemsRouter
  .route('/')
  .get((req, res, next) => {
    ItemService.getAll(req.app.get('db'), req.user.id)
      .then(items => {
        res.json(items.map(serialize));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name, description, user_id } = req.body;
    const newItem = { name, description, user_id };

    for (const [key, value] of Object.entries(newItem))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    const requiredFields = ['name', 'user_id'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const err = createError(400, `Missing '${field}' in request body`, {
          type: 'ValidationError',
          prop: field
        });
        return next(err);
      }
    }

    ItemService.insert(
      req.app.get('db'),
      newItem,
      req.user.id
    )
      .then(item => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, item.id.toString()))
          .json(serialize(item));
      });
  });

itemsRouter
  .route('/:item_id/')
  .get((req, res, next) => {
    ItemService.getById(
      req.app.get('db'),
      req.params.item_id,
      req.user.id
    )
      .then(item => {
        if (item) {
          res.json(serialize(item));
        } else {
          const err = createError(404, 'Not Found');
          return next(err);
        }
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { name, description } = req.body;
    if (name == null && description == null) {
      const err = createError(404, "Request body must content either 'title' or 'content'");
      return next(err);
    }

    const updateItem = {};
    if (name) updateItem.name = name;
    if (description) updateItem.description = description;

    ItemService.update(
      req.app.get('db'),
      req.params.item_id,
      updateItem,
      req.user.id
    )
      .then(item => {
        if (item) {
          res.status(204).end();
        } else {
          const err = createError(404, 'Not Found');
          return next(err);
        }
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    ItemService.delete(
      req.app.get('db'),
      req.params.item_id,
      req.user.id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = itemsRouter;
