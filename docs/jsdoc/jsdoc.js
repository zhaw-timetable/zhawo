const fs = require('fs');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');

const FRONTENDPATH = '../../source/frontend/app';
const BACKENDPATH = '../../source/backend/app';

function getFilePaths(directoryPath) {
  let content = { folders: [], files: [] };
  let fileObject;
  fs.readdirSync(directoryPath).forEach(file => {
    let fullPath = path.join(directoryPath, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      content.folders.push(file);
      let tempArray = getFilePaths(fullPath);
      content.files = Array.prototype.concat.apply(
        content.files,
        tempArray.files
      );
    } else {
      if (!fullPath.includes('test') && !fullPath.includes('.json')) {
        if (fullPath.includes('.js')) {
          fileObject = { name: file, path: fullPath };
          content.files.push(fileObject);
        }
      }
    }
  });
  return content;
}

function writeFile(filename, text) {
  fs.writeFile(filename, text, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(filename, 'was saved!');
  });
}

function getMD(path) {
  let content = getFilePaths(path);
  let docs = '';
  content.files.forEach(file => {
    console.log(file);
    docs = docs + '\n' + jsdoc2md.renderSync({ files: file.path });
  });

  return docs;
}

function main() {
  let actionsMD = getMD(FRONTENDPATH + '/actions');
  let stroesMD = getMD(FRONTENDPATH + '/stores');
  let adaptersMD = getMD(FRONTENDPATH + '/adapters');
  adaptersMD = adaptersMD.replace(
    /## Functions[\s\S]*?<\/dl>/g,
    '## ZHAWo Adapeter\nContains functions that handle everything ZHAW'
  );
  let containersMD = getMD(FRONTENDPATH + '/containers');

  let backendMD = getMD(BACKENDPATH);

  writeFile('Development:-Frontend:-Containers.md', containersMD);
  writeFile('Development:-Frontend:-Adapters.md', adaptersMD);
  writeFile('Development:-Frontend:-Stores.md', stroesMD);
  writeFile('Development:-Frontend:-Actions.md', actionsMD);
  writeFile('backend.md', backendMD);
}

//start main
if (require.main === module) {
  main();
}
