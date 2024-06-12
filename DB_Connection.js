const mysql = require('mysql2');
require('dotenv').config();

const DATA = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};
// Connection
const DB_connection = () => {
    return new Promise((resolve, reject) => {
        try {
            const connection = mysql.createConnection(DATA);
            connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
            connection.on('error', (err) => {
                console.error('Database connection error:', err);
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    resolve(DB_connection());
                } else {
                    reject(err);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = DB_connection;