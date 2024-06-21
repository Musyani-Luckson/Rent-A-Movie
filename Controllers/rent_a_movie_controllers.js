const DB_connection = require(`../DB_Connection`);
const { query } = require(`../SQL_Queries/queries`);
// const { myToken, clearCookie } = require('../MiddleWare/is_valid_token');
// Customer List
// Totals
module.exports.get_totals = async (req, res) => {
    const connection = await DB_connection();
    connection.query(query.GET_TOTALS, async (error, results) => {
    res.send(results);
    })
}
// 
module.exports.get_customer_list_data = async (req, res) => {
    const connection = await DB_connection();
    connection.query(query.GET_CUSTOMER_LIST_DATA, async (error, results) => {
        return res.send(results);
    })
}
// Transaction List
module.exports.get_transaction_list_data = async (req, res) => {
    const connection = await DB_connection();
    connection.query(query.GET_TRANSACTION_LIST_DATA, async (error, results) => {
        res.send(results);
    })
}
// Searching
module.exports.get_search_for_customer_data = async (req, res) => {
    const connection = await DB_connection();
    const key = Object.keys(req.query)[0];
    let value = req.query[key];
    if (key == "Phone_Number") {
        value = `+26${req.query[key].slice(-10)}`;
    }
    const SEARCH_QUERY = `SELECT * FROM Customer WHERE ${key} = ?`;
    connection.query(SEARCH_QUERY, [value], async (error, results) => {
        res.send(results);
    })
};
//
const checkZipCode = (connection, zip_code) => {
    return new Promise((resolve, reject) => {
        connection.query(query.CHECK_ZIP_CODE, [zip_code], (error, results) => {
            if (error) {
                return reject('Internal Server Error');
            }
            if (results.length === 0) {
                return reject('Invalid Zip Code');
            }
            resolve(results);
        });
    });
};
// 
const findCustomerByEmail = async (connection, email) => {
    return new Promise((resolve, reject) => {
        connection.query(query.CHECK_EMAIL, [email], async (error, results) => {
            if (error) {
                return reject('Internal Server Error');
            }
            if (results.length === 0) {
                return reject('Invalid Email');
            }
            resolve(results);
        });
    });
};
// 
module.exports.new_transaction = async (req, res) => {
    const { email, movies } = req.body
    const connection = await DB_connection();
    // Identify the customer using the email and get the ID
    findCustomerByEmail(connection, email)
        .then(results => {
            const Customer_ID = results[0].ID
            // make a transaction with that ID.
            const TRANSACTION = {
                Customer_ID,
                Transaction_Date: getCurrentTime()
            };
            connection.query(query.INSERT_TRANSACTION_QUERY, TRANSACTION, (error, transactionResults) => {
                // link that transaction ID to movies in the array

                const { insertId } = transactionResults;
                // then make each transaction details using one Transaction ID onto all movies on the list
                const TRANSACTION_DETAILS_PROMISES = movies.map((Movie_ID) => {
                    return new Promise((resolve, reject) => {
                        const TRANSACTION_DETAILS = {
                            Transaction_ID: insertId,
                            Movie_ID
                        };
                        // 
                        connection.query(query.INSERT_TRANSACTION_DETAILS_QUERY, TRANSACTION_DETAILS, (error, results) => {
                            if (error) {
                                return reject(error);
                            }
                            resolve(results);
                        });
                    });
                });
                // 
                Promise.all(TRANSACTION_DETAILS_PROMISES)
                    .then((results) => {
                        res.send(results);
                    })
                    .catch((error) => {
                        res.status(500).send(error);
                    });
            })
        })
        .catch(error => {
            res.send(error)
        });
}
// 
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
// Recent trnsactions
module.exports.get_recent_transactions = async (req, res) => {
    const connection = await DB_connection();
    connection.query(query.GET_10_RECENT_TRANSACTIONS, async (error, results) => {
        res.send(results);
    })
}
// 
// Recent trnsactions
module.exports.get_each_movie_earnings = async (req, res) => {
    const connection = await DB_connection();
    connection.query(query.GET_EACH_MOVIE_EARNINGS, async (error, results) => {
        res.send(results);
    })
}

// GET_RENTAL_STATUS_SUMMARY
module.exports.get_rental_status_summary = async (req, res) => {
    const connection = await DB_connection();
    connection.query(query.GET_RENTAL_STATUS_SUMMARY, async (error, results) => {
        return res.send(results);
    })
}
// 
module.exports.new_movie = async (req, res) => { }
// 
module.exports.new_customer = async (req, res) => {
    const { first_name, last_name, middle_name, email, phone_number, street_name, zip_code } = req.body;
    const validations = [
        {
            condition: !first_name, message: {
                message: 'Firstname is required.',
                target: `firstname`
            }
        },
        {
            condition: !last_name, message: {
                message: 'Lastname is required.',
                target: `lastname`
            }
        },
        {
            condition: !email, message: {
                message: 'Email is required.',
                target: `email`
            }
        },
        {
            condition: !phone_number, message: {
                message: 'Phone is required.',
                target: `phone`
            }
        },
        {
            condition: !street_name, message: {
                message: 'Street name is required.',
                target: `street`
            }
        },
        {
            condition: !zip_code, message: {
                message: 'Zip code is required.',
                target: `zip_code`
            }
        },
    ];

    for (let i = 0; i < validations.length; i++) {
        if (validations[i].condition) {
            return res.status(400).json({
                error: validations[i].message
            });
        }
    }
    const connection = await DB_connection();
    connection.query(query.CHECK_EMAIL, [email], (error, emailResults) => {
        if (error) {
            return res.status(500).send('Internal Server Error');
        }
        if (emailResults.length > 0) {
            return res.status(400).send(`[ ${email} ] is already in use.`);
        }
        connection.query(query.CHECK_PHONE, [phone_number], (error, phoneResults) => {
            if (error) {
                return res.status(500).send('Internal Server Error');
            } else {
                if (phoneResults.length > 0) {
                    return res.status(400).send(`Phone number [ ${phone_number} ] is already in use.`);
                } else {
                    checkZipCode(connection, zip_code)
                        .then(results => {
                            // res.send(results)
                            const Zip_Code_ID = Object.values(results[0])
                            const CUSTOMER = {
                                first_name,
                                last_name,
                                middle_name,
                                email,
                                phone_number
                            };
                            connection.query(query.INSERT_CUSTOMER_QUERY, CUSTOMER, (error, customerRessults) => {
                                if (error) {
                                    return res.status(500).json({ error: 'An error occurred while creating the customer.' });
                                } else {
                                    findCustomerByEmail(connection, email)
                                        .then(results => {
                                            const ADDRESS = {
                                                Street_Name: street_name,
                                                Customer_ID: customerRessults.insertId,
                                                Zip_Code_ID: Zip_Code_ID[0]
                                            };
                                            connection.query(
                                                query.INSERT_ADDRESS_QUERY,
                                                ADDRESS,
                                                (error, response) => {
                                                    res.send({ email })
                                                })
                                        }).catch(error => {
                                        });
                                }
                            });
                        })
                        .catch(error => {
                            res.send(error)
                        });
                    // 
                }
            }
        })
    })
};
