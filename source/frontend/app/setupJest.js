import fetch from 'jest-fetch-mock';
global.fetch = fetch;

process.env.NODE_ENV = 'test';
