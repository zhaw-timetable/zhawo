import '@babel/polyfill';
import fetch from 'jest-fetch-mock';
global.fetch = fetch;

process.env.NODE_ENV = 'test';

console.log = jest.fn();
