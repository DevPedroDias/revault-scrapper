import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { DataSource } from 'typeorm';
import { SearchModel } from './model/search.model';
import { SneakerModel } from './model/sneaker.model';
import { UserModel } from './model/user.model';
import { SyncModel } from './model/sync.model';

const dbPath = path.join(app.getPath('userData'), 'revault-data-tmp', 'dev.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

 const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: true,
  entities: [SearchModel, SneakerModel, UserModel, SyncModel],
});

export default AppDataSource