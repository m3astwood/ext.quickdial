import Dexie from 'dexie';

const db = new Dexie('QuickDial');

// Declare tables, IDs and indexes
db.version(1).stores({
  links: '++id, name, url',
});

export default db;
