
var mysql = require(`mysql2`);
const DB_connection = require(`../DB_Connection`);
// 
// Customer Entry
module.exports.customer_enetry = async (req, res) => {
    // Send a response back to the client
    res.send(`New Customer`);
}
// try {
//     const connection = await DB_connection();
//     connection.connect(function (err) {
//         if (err) throw err;
//         const sql = "SELECT * FROM Customer";
//         connection.query(sql, function (err, result) {
//             // Send a response back to the client
//             res.send(result);
//         });
//     });
// } catch (error) {
//     console.error('Failed to connect to the database:', error);
// }