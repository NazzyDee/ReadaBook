const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ReadaBookRecordingsDB', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('recordings')) {
        db.createObjectStore('recordings');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveVideoBlob = async (id: string, blob: Blob): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('recordings', 'readwrite');
    const store = tx.objectStore('recordings');
    const request = store.put(blob, id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getVideoBlob = async (id: string): Promise<Blob | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('recordings', 'readonly');
      const store = tx.objectStore('recordings');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB error:", error);
    return null;
  }
};

export const deleteVideoBlob = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('recordings', 'readwrite');
    const store = tx.objectStore('recordings');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
