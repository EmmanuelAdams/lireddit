"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'emmanuel2001',
    database: 'lireddit3',
    entities: ['dist/entities/*.js'],
    migrations: ['src/migration/**/*.ts'],
});
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map