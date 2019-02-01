BEGIN;

INSERT INTO blogful_users (
  id, first_name, last_name, email, screen_name, password
) VALUES
  (
    '500',
    'Bodeep',
    'Deboop',
    'b.deboop@dunder-mifflin.com',
    'bodeepadeboop',
    'p@ssw0rd!'
  ),
  (
    '501',
    'Joe',
    'Bloggs',
    'j.bloggs@dunder-mifflin.com',
    'j.b',
    'p@ssw0rd!'
  ),
  (
    '502',
    'Sam',
    'Smith',
    's.smith@dunder-mifflin.com',
    'smiddy',
    'p@ssw0rd!'
  ),
  (
    '503',
    'Alex',
    'Taylor',
    'a.tay@dunder-mifflin.com',
    'lexlor',
    'p@ssw0rd!'
  ),
  (
    '504',
    'Peng',
    'Won In',
    'wip@dunder-mifflin.com',
    'wippy',
    'p@ssw0rd!'
  );

INSERT INTO blogful_articles (id, title, content, author_id
) VALUES
  (
    '1000',
    'First post with an author',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, ut atque. Minima beatae ipsa ratione. Dolorem suscipit ullam temporibus repellendus quae atque expedita architecto corrupti doloremque ducimus eaque, eum ipsum!',
    '501'
  ),
  (
    '1001',
    'Second post with an author',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam minus esse, dolorum vitae neque ullam adipisci consequatur doloremque autem rerum doloribus officiis exercitationem culpa, temporibus eligendi, assumenda ex. Cupiditate, sequi.',
    '502'
  ),
  (
    '1002',
    'Third post with an author',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut et, eum id distinctio vel sint nulla dolorum vero perspiciatis debitis repudiandae officiis nostrum illo adipisci minus placeat in error. Voluptatum.',
    '503'
  );

COMMIT;
