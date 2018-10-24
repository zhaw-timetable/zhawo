import fetch from 'jest-fetch-mock';
jest.setMock('node-fetch', fetch);

process.env.NODE_ENV = 'test';
