"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'lireddit2',
    entities: ['dist/entities/*.js'],
    migrations: ['src/migration/**/*.ts'],
});
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map