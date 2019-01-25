const { expect } = require('chai');
const supertest = require('supertest');

process.env.DB_URL = process.env.TEST_DB_URL || 'postgresql://dunder-mifflin@localhost/blogful_test';

global.expect = expect;
global.supertest = supertest;
