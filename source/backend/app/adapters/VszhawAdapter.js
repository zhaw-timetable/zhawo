let Parser = require('rss-parser');
let parser = new Parser();

export async function getVszhawRSS() {
  return new Promise(async (resolve, reject) => {
    let feed = await parser.parseURL('https://www.vszhaw.ch/feed/');
    console.log(feed.title);

    resolve(feed.items);
  });
}
