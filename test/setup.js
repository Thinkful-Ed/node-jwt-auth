require('dotenv').config();
process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';

process.env.TEST_DB_URL = process.env.TEST_DB_URL || 'postgresql://localhost/listful_test';
