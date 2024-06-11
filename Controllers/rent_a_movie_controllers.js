
var mysql = require(`mysql2`);
const DB_connection = require(`../DB_Connection`);
const connection = DB_connection();
const path = require('path');
// 
// PAGES FNS
const pages = `../public`
// 1
module.exports.new_customer_page = async (req, res) => {
    res.sendFile(path.join(__dirname, `${pages}/add_customer.html`), (err) => {
        if (err) {
            res.status(500).send("Server error");
        }
    });
}
// 2
module.exports.new_movie_page = async (req, res) => {
    res.sendFile(path.join(__dirname, `${pages}/add_movie.html`), (err) => {
        if (err) {
            res.status(500).send("Server error");
        }
    });
}
// 3
module.exports.new_transaction_page = async (req, res) => {
    res.sendFile(path.join(__dirname, `${pages}/add_transaction.html`), (err) => {
        if (err) {
            res.status(500).send("Server error");
        }
    });
}
// 4
module.exports.get_customer_list_page = async (req, res) => {
    res.sendFile(path.join(__dirname, `${pages}/customer_list.html`), (err) => {
        if (err) {
            res.status(500).send("Server error");
        }
    });
}
// 5
module.exports.get_transaction_list_page = async (req, res) => {
    res.sendFile(path.join(__dirname, `${pages}/transaction_list.html`), (err) => {
        if (err) {
            res.status(500).send("Server error");
        }
    });
}
//


//


// 
// Customer List
module.exports.get_customer_list_data = async (req, res) => {
    try {
        // const connection = await DB_connection();
        connection.connect(function (err) {
            if (err) throw err;
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
            connection.query(SQL, function (err, result) {
                res.send(result);
            });
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}
// Transaction List
module.exports.get_transaction_list_data = async (req, res) => {
    try {
        // const connection = await DB_connection();
        connection.connect(function (err) {
            if (err) throw err;
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
    Customer_Name, Transaction_Date;`;
            connection.query(sql, function (err, result) {
                res.send(result);
            });
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}
// Searching
module.exports.get_search_for_customer_data = async (req, res) => {
    // const connection = await DB_connection();
    const key = Object.keys(req.query)[0];
    let value = req.query[key];
    const search_query = `SELECT * FROM Customer WHERE ${key} = ?`;

    if (key == "Phone_Number") {
        value = `+26${req.query[key].slice(-10)}`;
    }
    connection.query(search_query, [value], async (error, results) => {
        if (error) {
            res.status(500).send("An error occurred while fetching data.");
        } else {
            res.send({ results });
        }
    });
}
//



//



// 
module.exports.new_customer = async (req, res) => {
    res.send("new customer")
}
// 
module.exports.new_movie = async (req, res) => {
    res.send("new movie")
}
// 
module.exports.new_transaction = async (req, res) => {
    res.send("new transaction")
}