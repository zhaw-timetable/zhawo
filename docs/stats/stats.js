// copyFileFromServer => scp -r psituser@160.85.252.131:/srv/www/logs logs
const fs = require('fs');
const path = require('path');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const co = require('co');
const generate = require('node-chartist');
const htmlToImage = require('html-to-image');

function readFileAsync(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getLogFilePaths(directoryPath) {
  let files = [];
  fs.readdirSync(directoryPath).forEach(file => {
    let fullPath = path.join(directoryPath, file);
    files.push(fullPath);
  });
  return files;
}

function getLogData(files) {
  let content = [];
  files.forEach(file => {
    let lines = file.split('\n');

    lines.forEach(line => {
      let info = line.split(' --- ');

      content.push({ date: info[0], info: info[1] });
    });
  });
  let merged = [].concat.apply([], content);
  return merged;
}

function countInfo(info) {
  let count = {
    login: 0,
    roomsearch: 0,
    vszhaw: 0,
    mensa: 0,
    schedule: 0,
    users: {}
  };

  for (let i = 0; i < info.length; i++) {
    if (info[i].info) {
      if (info[i].info.includes('Schedules: student logged in')) {
        count.login += 1;
      }
      if (info[i].info.includes('Schedules: fetching info')) {
        // only add if no more coming
        if (info[i + 1].info) {
          if (!info[i + 1].info.includes('Schedules: fetching info')) {
            count.schedule += 1;
            let name = info[i].info.split(':')[2];
            if (name in count.users) {
              count.users[name] += 1;
            } else {
              count.users[name] = 0;
            }
          }
        } else {
          count.schedule += 1;
          let name = info[i].info.split(':')[2];
          if (name in count.users) {
            count.users[name] += 1;
          } else {
            count.users[name] = 0;
          }
        }
      }
      if (info[i].info.includes('Vszhaw: fetching rss feed')) {
        count.vszhaw += 1;
      }
      if (info[i].info.includes('Mensa: fetching mensa info')) {
        count.mensa += 1;
      }
      if (info[i].info.includes('Room Search: fetching free rooms')) {
        count.roomsearch += 1;
      }
    }
  }

  return count;
}

async function readCSV(path) {
  let data = await readFileAsync(path);

  let lines = data.split('\n');

  let titles = lines[0].replace(/["]+/g, '').split(',');

  let ansArray = [];

  for (let index = 1; index < lines.length; index++) {
    let temp = lines[index].replace(/["]+/g, '');
    let tempArray = temp.split(',');

    let tempObj = {};

    for (let j = 0; j < titles.length; j++) {
      tempObj[titles[j]] = tempArray[j];
    }

    ansArray.push(tempObj);
  }

  return ansArray;
}

function makeChart(name, labels, series) {
  let bar = '<link rel="stylesheet" type="text/css" href="chartist.css" />';
  co(function*() {
    const options = {
      width: 400,
      height: 200
    };

    bar += yield generate('bar', options, {
      labels: labels,
      series: [series]
    });

    fs.writeFile('./plots/' + name + '.html', bar, function(err) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('File is created successfully.');
    });
  });
}

function makePie(name, series) {
  let pie = '<link rel="stylesheet" type="text/css" href="chartist.css" />';
  co(function*() {
    const options = {
      width: 400,
      height: 200
    };

    pie += yield generate('pie', options, {
      series: series
    });

    fs.writeFile('./plots/' + name + '.html', pie, function(err) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('File is created successfully.');
    });
  });
}

function handleFeedback(feedback) {
  makeChart('bar', [1, 2, 3, 4, 5]);

  let labels = feedback.keys();

  let studiengang = [];
  let negativeFeedback = [];
  let positveFeedback = [];

  let usefulness = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let performance = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let design = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let countNo = 0;
  let countYes = 0;

  feedback.forEach(element => {
    studiengang.push(element.Studiengang);

    usefulness[element['How would you rate the usefulness of zhawo?']] += 1;
    performance[element['How would you rate the performance of zhawo?']] += 1;
    design[element['How would you rate the design of zhawo?']] += 1;

    positveFeedback.push(element['Positive feedback? What do you like?']);
    negativeFeedback.push(element['Negative feedback? Improvement ideas?']);

    if (element['Have you heard of progessive web apps?'] === 'No') {
      countNo += 1;
    } else {
      countYes += 1;
    }
  });

  // console.log(positveFeedback);
  // console.log(negativeFeedback);

  makeChart('usefulness', [1, 2, 3, 4, 5], objToArray(usefulness));
  makeChart('performance', [1, 2, 3, 4, 5], objToArray(performance));
  makeChart('design', [1, 2, 3, 4, 5], objToArray(design));

  makePie('pwa', [
    { name: 'Yes', value: countYes },
    { name: 'No', value: countNo }
  ]);
}

function objToArray(obj) {
  let temp = [];

  Object.keys(obj).forEach(key => {
    temp.push(obj[key]);
  });

  return temp;
}

function sortObjectByProps(obj) {
  // convert object into array
  let sortable = [];
  for (let key in obj)
    if (obj.hasOwnProperty(key)) sortable.push([key, obj[key]]); // each item is an array in format [key, value]

  // sort items by value
  sortable.sort(function(a, b) {
    return b[1] - a[1]; // compare numbers

    //return b[1] - a[1]; // for small to big
  });
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function handleLogs(logs) {
  // rank users

  let usernames = [];
  let views = [];

  let users = sortObjectByProps(logs.users);

  for (let index = 0; index < 10; index++) {
    usernames.push(users[index][0]);
    views.push(users[index][1]);
  }

  makeChart('users', usernames, views);
}

async function main() {
  let files = getLogFilePaths('./logs');

  let promises = files.map(file => readFileAsync(file));

  let content = await Promise.all(promises).then(getLogData);
  let logs = countInfo(content);

  let feedback = await readCSV('./feedback.csv');

  handleFeedback(feedback);
  handleLogs(logs);
  console.log('logs: ', logs);
}
//Your code here
if (require.main === module) {
  main();
}
