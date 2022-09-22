"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
exports.dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    database: 'lireddit2',
    username: 'postgres',
    password: 'postgres',
    logging: true,
    synchronize: true,
    entities: [
        'src/**/*.entity{.ts,.js}',
        'dist/**/*.entity{.ts,.js}',
    ],
});
//# sourceMappingURL=DataSource.js.map