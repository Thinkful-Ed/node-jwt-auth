BEGIN;




INSERT INTO blogful_users (
  id, first_name, last_name, email, screen_name, password
) VALUES
  (
    'fcdab65c-d063-45d4-8277-fff9c0230a88',
    'Bodeep',
    'Deboop',
    'b.deboop@dunder-mifflin.com',
    'bodeepadeboop',
    'p@ssw0rd!'
  ),
  (
    'f19d7725-c447-42d0-8b81-f41a16a97c34',
    'Joe',
    'Bloggs',
    'j.bloggs@dunder-mifflin.com',
    'j.b',
    'p@ssw0rd!'
  ),
  (
    '5b6620d4-1475-4f4a-b8dc-d1fa4c41023d',
    'Sam',
    'Smith',
    's.smith@dunder-mifflin.com',
    'smiddy',
    'p@ssw0rd!'
  ),
  (
    '821a24ae-40ad-4f04-ad46-efbb5322a1bb',
    'Alex',
    'Taylor',
    'a.tay@dunder-mifflin.com',
    'lexlor',
    'p@ssw0rd!'
  ),
  (
    '2ad8f2bc-23db-4ace-aa9d-4da4844da0f8',
    'Peng',
    'Won In',
    'wip@dunder-mifflin.com',
    'wippy',
    'p@ssw0rd!'
  );

INSERT INTO blogful_articles (id, title, content, author_id
) VALUES
  (
    'a7f400c6-8c29-46d0-b755-6239507df45e',
    'First post with an author',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, ut atque. Minima beatae ipsa ratione. Dolorem suscipit ullam temporibus repellendus quae atque expedita architecto corrupti doloremque ducimus eaque, eum ipsum!',
    'fcdab65c-d063-45d4-8277-fff9c0230a88'
  ),
  (
    '7b635a3f-ca35-4f46-9cc3-0c30e0ff4e30',
    'Second post with an author',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam minus esse, dolorum vitae neque ullam adipisci consequatur doloremque autem rerum doloribus officiis exercitationem culpa, temporibus eligendi, assumenda ex. Cupiditate, sequi.',
    '5b6620d4-1475-4f4a-b8dc-d1fa4c41023d'
  ),
  (
    '2acbdb56-2889-4589-8f29-39760170cba4',
    'Third post with an author',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut et, eum id distinctio vel sint nulla dolorum vero perspiciatis debitis repudiandae officiis nostrum illo adipisci minus placeat in error. Voluptatum.',
    'f19d7725-c447-42d0-8b81-f41a16a97c34'
  );

COMMIT;
