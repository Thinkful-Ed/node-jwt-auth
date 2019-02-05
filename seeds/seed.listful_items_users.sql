BEGIN;

INSERT INTO listful_users (
  id, fullname, username, password
) VALUES
  (
    '500',
    'Bodeep Deboop',
    'bodeepadeboop',
    'P@ssw0rd!'
  ),
  (
    '501',
    'Joe Bloggs',
    'Bloggs',
    'P@ssw0rd!'
  ),
  (
    '502',
    'Sam Smith',
    'smiddy',
    'P@ssw0rd!'
  ),
  (
    '503',
    'Alex Taylor',
    'lexlor',
    'P@ssw0rd!'
  ),
  (
    '504',
    'Peng Won In',
    'wippy',
    'P@ssw0rd!'
  );

INSERT INTO listful_items (id, name, description, user_id) VALUES
  (
    '1000',
    'Apples',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, ut atque. Minima beatae ipsa ratione. Dolorem suscipit ullam temporibus repellendus quae atque expedita architecto corrupti doloremque ducimus eaque, eum ipsum!',
    '501'
  ),
  (
    '1001',
    'Bananas',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam minus esse, dolorum vitae neque ullam adipisci consequatur doloremque autem rerum doloribus officiis exercitationem culpa, temporibus eligendi, assumenda ex. Cupiditate, sequi.',
    '501'
  ),
  (
    '1002',
    'Cherries',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut et, eum id distinctio vel sint nulla dolorum vero perspiciatis debitis repudiandae officiis nostrum illo adipisci minus placeat in error. Voluptatum.',
    '503'
  ),
  (
    '1003',
    'Dates',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut et, eum id distinctio vel sint nulla dolorum vero perspiciatis debitis repudiandae officiis nostrum illo adipisci minus placeat in error. Voluptatum.',
    '503'
  );

COMMIT;
