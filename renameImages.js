const fs = require('fs');
const path = require('path');

const dir = './images'; // or the path to your image folder

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jpg.jpg')) {
    const oldPath = path.join(dir, file);
    const newFile = file.replace('.jpg.jpg', '.jpg');
    const newPath = path.join(dir, newFile);

    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${file} → ${newFile}`);
  }
});
