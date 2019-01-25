const bcrypt = require('bcryptjs');

const SELECTABLE_COLUMNS = ['id', 'first_name', 'last_name', 'email', 'screen_name', 'date_published', 'date_modified'];
const UserService = {
  getAll(db) {
    return db('blogful_users')
      .select(SELECTABLE_COLUMNS);
  },

  getById(db, user_id) {
    return db('blogful_users')
      .first(SELECTABLE_COLUMNS)
      .where({
        id: user_id
      });
  },

  insertUser(db, newUser) {
    return bcrypt.hash(newUser.password, 10)
      .then(hash => {
        newUser.password = hash;
        return db('blogful_users')
          .insert(newUser)
          .returning(SELECTABLE_COLUMNS);
      })
      .then(([user]) => user);
  },

  updateUser(db, id, newUserFields) {
    return db('blogful_users')
      .update(newUserFields)
      .where({ id })
      .returning(SELECTABLE_COLUMNS);
  },

  deleteUser(db, id) {
    return db('blogful_users')
      .delete()
      .where({ id });
  },

  hasUser(db, id) {
    return db('blogful_users')
      .first('id')
      .where({ id })
      .then(user => !!user);
  },

  hasUserWithEmail(db, email) {
    return db('blogful_users')
      .first('id')
      .where({ email })
      .then(user => !!user);
  },

  getByEmail(db, email) {
    return db('blogful_users')
      .first('*')
      .where({ email });
  }
};

module.exports = UserService;
