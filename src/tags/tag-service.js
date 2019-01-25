
const TagService = {
  getAll(db) {
    return db
      .from('blogful_tags')
      .select('*')
  },

  getById(db, id) {
    return db
      .from('blogful_tags')
      .where({ id })
      .first()
  },

  hasTag(db, id) {
    return db('blogful_tags')
      .select('id')
      .where({ id })
      .first()
      .then(tag => !!tag)
  },

  insertTag(db, newTag) {
    return db
      .insert(newTag)
      .into('blogful_tags')
      .returning('*')
      .then(([tag]) => tag)
  },

  updateTag(db, id, newTagFields) {
    return db('blogful_tags')
      .where({ id })
      .update(newTagFields)
  },

  deleteTag(db, id) {
    return db('blogful_tags')
      .where({ id })
      .delete()
  },

  getArticleIdsWithTag(db, tag_id) {
    return db('blogful_articles_tags')
      .select('*')
      .where({ tag_id })
  }
}

module.exports = TagService
