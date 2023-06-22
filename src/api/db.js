import { Connection } from 'jsstore';
import workerInjector from 'jsstore/dist/worker_injector';

const db = new Connection();
db.addPlugin(workerInjector);

const linksTable = {
  name: 'links',
  columns: {
    id: { primaryKey: true, autoIncrement: true },
    name: { dataType: 'string' },
    url: { notNull: true, dataType: 'string', unique: true },
    cat_id: { default: 0, dataType: 'number', notNull: true },
  },
};

// TOOD@me: categories table '++id, name',
const categoriesTable = {
  name: 'categories',
  columns: {
    id: { primaryKey: true, autoIncrement: true },
    name: { dataType: 'string', notNull: true, unique: true },
  },
};

db.initDb({
  name: 'QuickDial',
  tables: [ linksTable, categoriesTable ],
});

db.insert({
  into: 'categories',
  values: [
    {
      id: 0,
      name: 'default',
    },
  ],
});

export default db;
