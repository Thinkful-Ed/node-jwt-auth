const bcrypt = require('bcryptjs');

const SELECTABLE_COLUMNS = ['id', 'fullname', 'username'];
const UserService = {
  getAll(db) {
    return db
      .select(SELECTABLE_COLUMNS)
      .from('listful_users');
  },

  getById(db, user_id) {
    return db
      .first(SELECTABLE_COLUMNS)
      .where({id: user_id})
      .from('listful_users');
  },

  insertUser(db, newUser) {
    return bcrypt.hash(newUser.password, 10)
      .then(hash => {
        newUser.password = hash;
        return db
          .insert(newUser)
          .into('listful_users')
          .returning(SELECTABLE_COLUMNS);
      })
      .then(([user]) => user);
  },

  updateUser(db, id, newUserFields) {
    return db('listful_users')
      .update(newUserFields)
      .where({ id })
      .returning(SELECTABLE_COLUMNS);
  },

  deleteUser(db, id) {
    return db
      .delete()
      .from('listful_users')
      .where({ id });
  },

  hasUser(db, username) {
    return db
      .first('id')
      .from('listful_users')
      .where({ username })
      .then(user => !!user);
  },

  getByUsername(db, username) {
    return db
      .first('*')
      .from('listful_users')
      .where({ username });
  }
};

module.exports = UserService;
