// db.js
const mysql = require('mysql2');
require('dotenv').config();

const DB_connection = () => {
    return new Promise((resolve, reject) => {
        try {
            const DATA = {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            };

            const con = mysql.createConnection(DATA);

            con.connect((err) => {
                if (err) {
                    console.error('Error connecting to the database:', err.stack);
                    reject(err);
                } else {
                    console.log('Connected to the database as ID ' + con.threadId);
                    resolve(con);
                }
            });
            // Handle connection errors after the initial connection is established
            con.on('error', (err) => {
                console.error('Database connection error:', err.stack);
            });

        } catch (error) {
            console.error('Unexpected error during database connection setup:', error);
            reject(error);
        }
    });
};

module.exports = DB_connection;
