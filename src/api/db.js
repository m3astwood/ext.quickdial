import Dexie from 'dexie';

const db = new Dexie('QuickDial');

db.version(1).stores({
  links: '++id, order, name, url, cat_id',
  categories: '++id, name, order',
});

db.categories.add({
  id: 0,
  name: 'default',
  order: 0,
});

export default db;
