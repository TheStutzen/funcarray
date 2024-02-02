const syncData = require('./sync');

const fs = require('fs');

const ogFile = './data/external.json';
const parsedOgFile = JSON.parse(fs.readFileSync(ogFile, 'utf8'));

const bgFile = './data/synced.json';
const parsedBgFile = JSON.parse(fs.readFileSync(bgFile, 'utf8'));

const result = syncData(parsedOgFile, parsedBgFile);

console.log('Товары для удаления:', result.toDelete);
console.log('Товары для добавления:', result.toAdd);
console.log('Товары для обновления цены:', result.toUpdate);

for (const idToDelete of result.toDelete) {
    const indexToDelete = parsedBgFile.findIndex((item) => item.id === idToDelete);
    if (indexToDelete !== -1) {
      parsedBgFile.splice(indexToDelete, 1);
    }
  }
  
  for (const idToAdd of result.toAdd) {
    const newItem = parsedOgFile.find((item) => item.id === idToAdd);
    if (newItem) {
      parsedBgFile.push(newItem);
    }
  }
  
  for (const updateItem of result.toUpdate) {
    const indexToUpdate = parsedBgFile.findIndex((item) => item.id === updateItem.id);
    if (indexToUpdate !== -1) {
      parsedBgFile[indexToUpdate].price = updateItem.newPrice;
    }
  }
  
  
  const syncedFile = './data/synced.json';
  fs.writeFileSync(syncedFile, JSON.stringify(parsedBgFile, null, 2), 'utf8');