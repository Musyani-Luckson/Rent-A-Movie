
var mysql = require(`mysql2`);
const DB_connection = require(`../DB_Connection`);
// const connection = DB_connection();
const path = require('path');
// const { myToken, clearCookie } = require('../MiddleWare/is_valid_token');

// 
// PAGES FNS
const pages = `../Public`
// 1
module.exports.new_customer_page = async (req, res) => {
    res.sendFile('add_customer.html', {
        root: path.join(__dirname, `${pages}`)
    }, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}
// 2
module.exports.new_movie_page = async (req, res) => {
    res.sendFile('add_movie.html', {
        root: path.join(__dirname, `${pages}`)
    }, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}
// 3
module.exports.new_transaction_page = async (req, res) => {
    res.sendFile('add_transaction.html', {
        root: path.join(__dirname, `${pages}`)
    }, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}
// 4
module.exports.get_customer_list_page = async (req, res) => {
    res.sendFile('customer_list.html', {
        root: path.join(__dirname, `${pages}`)
    }, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}
// 5
module.exports.get_transaction_list_page = async (req, res) => {
    res.sendFile('transaction_list.html', {
        root: path.join(__dirname, `${pages}`)
    }, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}
//
//
// 
// Customer List
module.exports.get_customer_list_data = async (req, res) => {
    let connection;

    try {
        connection = await DB_connection();
        const SQL = `SELECT * FROM (
                        SELECT DISTINCT
                        C.Customer_ID,
                        C.Phone_Number,
                        CONCAT (C.Last_Name, ' ', C.Middle_Name, ' ', C.First_Name) AS Customer_Name,
                        A.Street_Name AS Street_Address,
                        Z.City AS City,
                        Z.State AS State,
                        Z.Zip_Code AS Zip_Code
                        FROM
                		    Address A
                        INNER JOIN
                            Customer C ON A.Customer_ID= C.Customer_ID
                        INNER JOIN
                            Zip_Code Z ON A.Zip_Code_ID= Z.Zip_Code_ID
                        ) AS subquery
                        ORDER BY
                	    Customer_Name ASC;`;


        const [results] = await connection.query(SQL);
        res.send({ results });
    } catch (error) {
        res.status(500).send("An error occurred while fetching data.");
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
// Transaction List
module.exports.get_transaction_list_data = async (req, res) => {
    let connection;

    try {
        connection = await DB_connection();
        const sql = `SELECT * FROM (
    SELECT DISTINCT 
        T.Transaction_Date, 
        CONCAT(C.Last_Name, ' ', IFNULL(C.Middle_Name, ''), ' ', C.First_Name) AS Customer_Name,
        M.Movie_Title,
        M_P.Movie_Price,
        ROUND(M_P.Movie_Price * 0.10, 2) AS Entertainment_Tax,
        ROUND((M_P.Movie_Price + (M_P.Movie_Price * 0.10)), 2) AS Total_Movie_Price
    FROM 
        Transaction_Details T_D
    INNER JOIN 
        Transaction T ON T_D.Transaction_ID = T.Transaction_ID
    INNER JOIN 
        Customer C ON T.Customer_ID = C.Customer_ID
    INNER JOIN 
        Movie M ON T_D.Movie_ID = M.Movie_ID
    INNER JOIN 
        Movie_Price M_P ON M.Movie_Price_ID = M_P.Movie_Price_ID
    INNER JOIN 
        Entertainment_Tax E_T ON M_P.Tax_ID = E_T.Tax_ID
) AS subquery
ORDER BY
    Customer_Name, Transaction_Date;`



        const [results] = await connection.query(sql);
        res.send({ results });
    } catch (error) {
        res.status(500).send("An error occurred while fetching data.");
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
// Searching
module.exports.get_search_for_customer_data = async (req, res) => {
    let connection;
    try {
        connection = await DB_connection();
        const key = Object.keys(req.query)[0];
        let value = req.query[key];
        const search_query = `SELECT * FROM Customer WHERE ${key} = ?`;

        if (key == "Phone_Number") {
            value = `+26${req.query[key].slice(-10)}`;
        }

        const [results] = await connection.query(search_query, [value]);
        res.send({ results });
    } catch (error) {
        console.error('Error during database operation:', error);
        res.status(500).send("An error occurred while fetching data.");
    } finally {
        if (connection) {
            connection.release();
            console.log('Connection released.');
        }
    }
};

//



//

const checkZipCode = (connection, zip_code) => {
    return new Promise((resolve, reject) => {
        const checkZipCodeQuery = 'SELECT Zip_Code_ID FROM Zip_Code WHERE zip_code = ?';
        connection.query(checkZipCodeQuery, [zip_code], (error, results) => {
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




    try {
        connection = await DB_connection();
        const checkByEmail = 'SELECT Customer_ID FROM Customer WHERE email = ?';

        return new Promise(async (resolve, reject) => {
            const [results] = await connection.query(checkByEmail);
            // res.send({ results });
            if (error) {
                return reject('Internal Server Error');
            }
            if (results.length === 0) {
                return reject('Invalid email');
            }
            resolve(results);
        });
    } catch (error) {
        res.status(500).send("An error occurred while fetching data.");
    } finally {
        if (connection) {
            connection.release();
        }
    }



};
// 
module.exports.new_customer = async (req, res) => {

    const { first_name, last_name, middle_name, email, phone_number, street_name, zip_code } = req.body;
    const connection = await DB_connection();
    const checkEmailQuery = 'SELECT email FROM Customer WHERE email = ?';
    const checkPhoneQuery = 'SELECT phone_number FROM Customer WHERE phone_number = ?';
    // Validate input before proceeding with the database query
    if (!first_name || first_name.trim() === '') {
        return res.status(400).json({ error: 'Firstname is required.' });
    }
    if (!last_name || last_name.trim() === '') {
        return res.status(400).json({ error: 'Lastname is required.' });
    }
    if (!email || email.trim() === '') {
        return res.status(400).json({ error: 'Email is required.' });
    }
    if (!phone_number || phone_number.trim() === '') {
        return res.status(400).json({ error: 'Phone number is required.' });
    }
    if (!street_name || street_name.trim() === '') {
        return res.status(400).json({ error: 'Street name is required.' });
    }
    if (!zip_code || zip_code.trim() === '') {
        return res.status(400).json({ error: 'Zip code is required.' });
    }
    connection.query(checkEmailQuery, [email], (error, emailResults) => {
        if (error) {
            return res.status(500).send('Internal Server Error');
        }
        if (emailResults.length > 0) {
            return res.status(400).send(`[ ${email} ] is already in use.`);
        } else {
            connection.query(checkPhoneQuery, [phone_number], (error, phoneResults) => {
                if (error) {
                    return res.status(500).send('Internal Server Error');
                }
                if (phoneResults.length > 0) {
                    return res.status(400).send(`Phone number [ ${phone_number} ] is already in use.`);
                } else {
                    checkZipCode(connection, zip_code)
                        .then(results => {
                            const Zip_Code_ID = Object.values(results[0])
                            const INSERT_CUSTOMER_QUERY = `INSERT INTO Customer SET ?`;
                            const CUSTOMER = {
                                first_name,
                                last_name,
                                middle_name,
                                email,
                                phone_number
                            };
                            connection.query(INSERT_CUSTOMER_QUERY, CUSTOMER, (error, results) => {
                                if (error) {
                                    return res.status(500).json({ error: 'An error occurred while creating the customer.' });
                                } else {
                                    findCustomerByEmail(connection, email)
                                        .then(results => {
                                            const Customer_ID = Object.values(results[0])
                                            const INSERT_ADDRESS_QUERY = `INSERT INTO Address SET ?`;
                                            const ADDRESS = {
                                                Street_Name: street_name,
                                                Customer_ID: Customer_ID[0],
                                                Zip_Code_ID: Zip_Code_ID[0]
                                            };
                                            connection.query(INSERT_ADDRESS_QUERY, ADDRESS, (error, results) => {
                                                res.send(`Customer Added`)
                                            })
                                        })
                                        .catch(error => {
                                        });
                                }
                            });
                        })
                        .catch(error => {
                        });
                }
            });
        }
    });

};
// 
module.exports.new_movie = async (req, res) => {
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
}
// 
module.exports.new_transaction = async (req, res) => {
    const { email, movies } = req.body

    let connection;
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


    // const connection = await DB_connection();

    // Identify the customer using the email and get the ID
    findCustomerByEmail(connection, email)
        .then(results => {
            const Customer_ID = Object.values(results[0])
            // make a transaction with that ID.
            const INSERT_TRANSACTION_QUERY = `INSERT INTO Transaction SET ?`;
            const TRANSACTION = {
                Customer_ID: Customer_ID[0],
                Transaction_Date: getCurrentTime()
            };
            connection.query(INSERT_TRANSACTION_QUERY, TRANSACTION, (error, results) => {
                // link that transaction ID to movies in the array
                const { insertId } = results;
                const INSERT_TRANSACTION_DETAILS_QUERY = `INSERT INTO Transaction_Details SET ?`;
                // then make each transaction details using one Transaction ID onto all movies on the list
                const TRANSACTION_DETAILS_PROMISES = movies.map((Movie_ID) => {
                    return new Promise((resolve, reject) => {
                        const TRANSACTION_DETAILS = {
                            Transaction_ID: insertId,
                            Movie_ID
                        };
                        // 
                        connection.query(INSERT_TRANSACTION_DETAILS_QUERY, TRANSACTION_DETAILS, (error, results) => {
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
    let connection;
    try {
        connection = await DB_connection();
        RecentTransactions = `SELECT 
            t.Transaction_ID,
    CONCAT(c.First_Name, ' ', IFNULL(c.Middle_Name, ''), ' ', c.Last_Name) AS Customer_Name,
    COUNT(td.Movie_ID) AS Movies,
    ROUND(SUM(mp.Movie_Price), 2) AS Movies_Total,
    ROUND(SUM(mp.Movie_Price) * 0.10, 2) AS Total_Tax,
    ROUND(SUM(mp.Movie_Price) * 1.10, 2) AS Total_With_Tax,
    t.Transaction_Date
FROM 
    Transaction t
JOIN 
    Customer c ON t.Customer_ID = c.Customer_ID
JOIN 
    Transaction_Details td ON t.Transaction_ID = td.Transaction_ID
JOIN 
    Movie m ON td.Movie_ID = m.Movie_ID
JOIN 
    Movie_Price mp ON m.Movie_Price_ID = mp.Movie_Price_ID
GROUP BY 
    t.Transaction_ID, Customer_Name, t.Transaction_Date
ORDER BY 
    t.Transaction_Date DESC
    LIMIT 10;`
        const [results] = await connection.query(RecentTransactions);
        // return res.send(JSON.stringify(result));
        res.send({ results });
    } catch (error) {
        res.status(500).send("An error occurred while fetching data.");
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
// 
// Recent trnsactions
module.exports.get_each_movie_earnings = async (req, res) => {


    let connection;
    try {
        connection = await DB_connection();
        const eachMovieQuery = `SELECT 
    M.Movie_ID,
    M.Movie_Title,
    COUNT(TD.Transaction_Details_ID) AS Total_Transactions,
    ROUND(MP.Movie_Price,2) AS Actual_Price,
    ROUND(SUM(MP.Movie_Price),2) AS Total_Price_Without_Tax,
    ROUND(SUM(MP.Movie_Price * 0.10),2) AS Total_Tax_Amount,
    ROUND(SUM(MP.Movie_Price * 1.10),2) AS Total_Price_With_Tax
FROM 
    Movie M
JOIN 
    Transaction_Details TD ON M.Movie_ID = TD.Movie_ID
JOIN 
    Transaction T ON TD.Transaction_ID = T.Transaction_ID
JOIN 
    Movie_Price MP ON M.Movie_Price_ID = MP.Movie_Price_ID
GROUP BY 
    M.Movie_ID, M.Movie_Title, MP.Movie_Price
ORDER BY 
    Total_Transactions DESC;
`;
        const [results] = await connection.query(eachMovieQuery);
        res.send({ results });
    } catch (error) {
        res.status(500).send("An error occurred while fetching data.");
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
//
// Totals
module.exports.get_totals = async (req, res) => {

    let connection;
    try {
        connection = await DB_connection();
        const totalQuery = `SELECT 
    ROUND((SELECT SUM(MP.Movie_Price * 1.10) 
     FROM Transaction_Details TD
     JOIN Movie M ON TD.Movie_ID = M.Movie_ID
     JOIN Movie_Price MP ON M.Movie_Price_ID = MP.Movie_Price_ID
    ),2) AS Earnings,
    
    (SELECT COUNT(*) FROM Customer) AS Total_Customers,
    
    (SELECT COUNT(*) FROM Movie) AS Total_Movies,
    
    (SELECT COUNT(*) FROM Transaction_Details) AS Total_Transactions;
`;
        const [results] = await connection.query(totalQuery);
        res.send({ results });
    } catch (error) {
        res.status(500).send("An error occurred while fetching data.");
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
//
// get_rental_status_summary
module.exports.get_rental_status_summary = async (req, res) => {


    let connection;
    try {
        connection = await DB_connection();
        const totalQuery = `SELECT 
    (SELECT COUNT(*) 
     FROM Movie 
     WHERE Movie_ID IN (SELECT DISTINCT Movie_ID FROM Transaction_Details)
    ) AS Rented_Movies,
    (SELECT COUNT(*) 
     FROM Movie 
     WHERE Movie_ID NOT IN (SELECT DISTINCT Movie_ID FROM Transaction_Details)
    ) AS Not_Rented_Movies,
    (SELECT COUNT(*)
     FROM Customer 
     WHERE Customer_ID IN (SELECT DISTINCT Customer_ID FROM Transaction)
    ) AS Renting_Customers,
    (SELECT COUNT(*)
     FROM Customer 
     WHERE Customer_ID NOT IN (SELECT DISTINCT Customer_ID FROM Transaction)
    ) AS Not_Renting_Customers;`;
        const [results] = await connection.query(totalQuery);
        res.send({ results });
    } catch (error) {
        res.status(500).send("An error occurred while fetching data.");
    } finally {
        if (connection) {
            connection.release();
        }
    }
}





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