
var mysql = require(`mysql2`);
const DB_connection = require(`../DB_Connection`);
// 
// Customer List
module.exports.customer_list = async (req, res) => {
    try {
        const connection = await DB_connection();
        connection.connect(function (err) {
            if (err) throw err;
            const sql = "SELECT * FROM Customer";
            connection.query(sql, function (err, result) {
                // Send a response back to the client
                res.send(result);
            });
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

// Transaction List
module.exports.transaction_list = async (req, res) => {
    try {
        const connection = await DB_connection();
        connection.connect(function (err) {
            if (err) throw err;
            const sql = "SELECT * FROM Transaction";
            connection.query(sql, function (err, result) {
                // Send a response back to the client
                res.send(result);
            });
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

// Searching
module.exports.search_for_customer = (req, res) => {
    // Send a response back to the client
    res.send('searching...');
}
