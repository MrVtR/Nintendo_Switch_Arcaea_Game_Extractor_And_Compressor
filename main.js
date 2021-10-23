fs = require('fs');
var prompt = require('prompt-sync')();
var bufferLib = require('buffer');
const jsonIndex = require('./arc.json');

var option = prompt('Choose an option: ');

switch (option) {
  case '1':
    extract();
    break;
  case '2':
    compress();
    break;
  default:
    console.log('Invalid option!');
}

function extract() {
  const arcaeaGroups = jsonIndex.Groups;
  const gameFolder = 'Arcaea_output';

  if (!fs.existsSync(gameFolder)) {
    fs.mkdirSync(gameFolder, { recursive: true });
  }

  fs.open('arc.pack', 'r', function (status, fd) {
    if (status) {
      console.log(status.message);
      return;
    }
    arcaeaGroups.forEach((folder) => {
      let fileFolder = gameFolder + '/' + folder.Name;
      let cont = 0;
      folder.OrderedEntries.forEach((file) => {
        cont++;
        filePath = file.OriginalFilename.split('/');
        if (cont == 1) {
          for (let i = 0; i < filePath.length - 1; i++) {
            fileFolder = fileFolder.concat('/', filePath[i]);
          }
        }
        if (!fs.existsSync(fileFolder)) {
          fs.mkdirSync(fileFolder, { recursive: true });
        }
        var buffer = bufferLib.Buffer.alloc(file.Length);
        var writePath = fileFolder + '/' + filePath[filePath.length - 1];
        var fileName = filePath[filePath.length - 1];
        fs.read(fd, buffer, 0, file.Length, file.Offset, function (err, num) {
          fs.writeFile(writePath, buffer, (err) => {
            if (err) throw err;
            console.log(fileName + ' extracted!');
          });
        });
      });
    });
  });
}

function compress() {
  console.log('Compressing function...');
}
