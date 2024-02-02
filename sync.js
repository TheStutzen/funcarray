const fs = require('fs');

function syncData(orig, sync) {
  const toDelete = [];
  const toAdd = [];
  const toUpdate = [];

  for (const syncData of sync) {
    const foundInSync = orig.find((origData) => origData.id === syncData.id);

    if (!foundInSync) {
      toDelete.push(syncData.id);
    } else if (foundInSync.price !== syncData.price) {
      toUpdate.push({
        id: syncData.id,
        newPrice: foundInSync.price,
      });
    }
  }

  for (const origData of orig) {
    const foundInOrig = sync.find((syncData) => syncData.id === origData.id);
    const foundInSynced = sync.find((syncData) => syncData.externalId === origData.externalId);

    if (!foundInOrig) {
      toAdd.push(origData.id);
    }

    if (!foundInSynced) {
      toAdd.push(origData.externalId);
    } else if (foundInSynced.price !== origData.price) {
      toUpdate.push({
        id: origData.externalId,
        newPrice: origData.price,
      });
    }
  }

  return {
    toDelete,
    toAdd,
    toUpdate,
  };
}


module.exports = syncData;
