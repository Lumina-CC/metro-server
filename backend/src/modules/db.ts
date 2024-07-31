import * as mysql from 'mysql2/promise';

export const sqlp = mysql.createPool({
    host: 'db',
    port: 3306,
    user: 'metroweb',
    password: process.env.DBKEY,
    database: 'metro',
});