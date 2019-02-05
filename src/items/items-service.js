const ItemService = {
  getAll(db, user_id) {
    return db
      .select('*')
      .where({ user_id })
      .from('listful_items');
  },

  getById(db, id, user_id) {
    return db
      .first('*')
      .from('listful_items')
      .where({ id, user_id });
  },

  insert(db, newItem, user_id) {
    newItem.user_id = user_id;
    return db
      .insert(newItem)
      .into('listful_items')
      .returning('*');
  },

  update(db, id, updateItem, user_id) {
    updateItem.user_id = user_id; // ensure user_id is set correctly
    return db('listful_items')
      .update(updateItem)
      .where({ id, user_id });
  },

  delete(db, id, user_id) {
    return db
      .delete()
      .from('listful_items')
      .where({ id, user_id });
  },

};

module.exports = ItemService;
