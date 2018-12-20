import Parser from 'rss-parser';

export const parser = new Parser();

export async function getVszhawRSS() {
  return new Promise(async (resolve, reject) => {
    let feed = await parser.parseURL('https://www.vszhaw.ch/feed/');
    resolve(feed.items);
  });
}
