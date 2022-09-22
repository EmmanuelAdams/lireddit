"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    database: 'lireddit2',
    username: 'postgres',
    password: 'emmanuel2001',
    logging: true,
    synchronize: true,
    entities: ['src/entities/*.ts'],
});
//# sourceMappingURL=data-source.js.map