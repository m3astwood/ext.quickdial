import Dexie from 'dexie';

const db = new Dexie('QuickDial');

// Declare tables, IDs and indexes
db.version(2).stores({
  links: '++id, name, url, cat_id',
  categories: '++id, name',
});

export default db;
