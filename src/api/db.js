import { Connection } from 'jsstore';
import workerInjector from 'jsstore/dist/worker_injector';

const db = new Connection();
db.addPlugin(workerInjector);

// TOOD@me: categories table '++id, name',
const linksTable = {
  name: 'links',
  columns: {
    id: { primaryKey: true, autoIncrement: true },
    name: { dataType: 'string' },
    url: { notNull: true, dataType: 'string', unique: true },
  },
};

db.initDb({
  name: 'QuickDial',
  tables: [ linksTable ],
});

export default db;
