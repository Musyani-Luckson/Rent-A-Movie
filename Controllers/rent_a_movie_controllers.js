var mysql = require(`mysql2`);
const DB_connection = require(`../DB_Connection`);
// 
module.exports.customer_list = async (req, res) => {
    try {
        const con = await DB_connection();
        con.connect(function (err) {
            if (err) throw err;
            const sql = "SELECT * FROM Customer";
            con.query(sql, function (err, result) {
                // Send a response back to the client
                res.send(result);
            });
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
    // Send a response back to the client
    // res.send('Customer list route accessed');
}
// 
module.exports.transaction_list = async (req, res) => {
    try {
        const con = await DB_connection();
        con.connect(function (err) {
            if (err) throw err;
            const sql = "SELECT * FROM Transaction";
            con.query(sql, function (err, result) {
                // Send a response back to the client
                res.send(result);
            });
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
    // // Send a response back to the client
    // res.send('Transaction list route accessed');
}
// 
module.exports.search_for_customer = (req, res) => {
    // Send a response back to the client
    res.send('searching...');
}
