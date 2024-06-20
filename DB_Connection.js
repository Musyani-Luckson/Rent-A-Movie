// const mysql = require('mysql2');
// require('dotenv').config();

// const DATA = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,  // Adjust the pool size as necessary
//     queueLimit: 0        // Unlimited queue limit
// };
// // Connection
// const DB_connection = () => {
//     return new Promise((resolve, reject) => {
//         try {
//             const connection = mysql.createConnection(DATA);
//             connection.connect((err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(connection);
//                 }
//             });
//             connection.on('error', (err) => {
//                 console.error('Database connection error:', err);
//                 if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//                     resolve(DB_connection());
//                 } else {
//                     reject(err);
//                 }
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// };
//
//
const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const DB_connection = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Connection acquired.');
        return connection;
    } catch (error) {
        console.error('Error acquiring connection:', error);
        throw error;
    }
};
module.exports = DB_connection;