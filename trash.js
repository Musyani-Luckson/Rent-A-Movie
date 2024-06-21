
// let connection;
// try {
//     connection = await DB_connection();
//     const SQL = `SELECT * FROM Customer WHERE ${key} = ?`;
//     const [results] = await connection.query(SQL);
//     res.send({ results });
// } catch (error) {
//     res.status(500).send("An error occurred while fetching data.");
// } finally {
//     if (connection) {
//         connection.release();
//     }
// }



// // PAGES FNS
// const pages = `../Public`
// // 1
// module.exports.new_customer_page = async (req, res) => {
//     res.sendFile('add_customer.html', {
//         root: path.join(__dirname, `${pages}`)
//     }, (err) => {
//         if (err) {
//             res.status(500).send(err);
//         }
//     });
// }
// // 2
// module.exports.new_movie_page = async (req, res) => {
//     res.sendFile('add_movie.html', {
//         root: path.join(__dirname, `${pages}`)
//     }, (err) => {
//         if (err) {
//             res.status(500).send(err);
//         }
//     });
// }
// // 3
// module.exports.new_transaction_page = async (req, res) => {
//     res.sendFile('add_transaction.html', {
//         root: path.join(__dirname, `${pages}`)
//     }, (err) => {
//         if (err) {
//             res.status(500).send(err);
//         }
//     });
// }
// // 4
// module.exports.get_customer_list_page = async (req, res) => {
//     res.sendFile('customer_list.html', {
//         root: path.join(__dirname, `${pages}`)
//     }, (err) => {
//         if (err) {
//             res.status(500).send(err);
//         }
//     });
// }
// // 5
// module.exports.get_transaction_list_page = async (req, res) => {
//     res.sendFile('transaction_list.html', {
//         root: path.join(__dirname, `${pages}`)
//     }, (err) => {
//         if (err) {
//             res.status(500).send(err);
//         }
//     });
// }
//