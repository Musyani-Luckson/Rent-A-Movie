module.exports.query = {
    GET_CUSTOMER_LIST_DATA: `SELECT * FROM (
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
                	    Customer_Name ASC;`,
    GET_TRANSACTION_LIST_DATA: `SELECT * FROM (
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
    Customer_Name, Transaction_Date;`,
    CHECK_ZIP_CODE: `SELECT Zip_Code_ID FROM Zip_Code WHERE Zip_Code = ?`,
    FIND_CUSTOMER_BY_EMAIL: `SELECT Customer_ID FROM Customer WHERE email = ?`,
    CHECK_EMAIL: `SELECT Customer_ID AS ID,email FROM Customer WHERE email = ?`,
    CHECK_PHONE: `SELECT phone_number FROM Customer WHERE phone_number = ?`,
    INSERT_CUSTOMER_QUERY: `INSERT INTO Customer SET ?`,
    INSERT_ADDRESS_QUERY: `INSERT INTO Address SET ?`,
    INSERT_TRANSACTION_QUERY: `INSERT INTO Transaction SET ?`,
    INSERT_TRANSACTION_DETAILS_QUERY: `INSERT INTO Transaction_Details SET ?`,
    GET_10_RECENT_TRANSACTIONS: `SELECT 
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
    LIMIT 10;`,
    GET_EACH_MOVIE_EARNINGS: `SELECT 
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
    Total_Transactions DESC;`,
    GET_TOTALS: `SELECT 
    ROUND((SELECT SUM(MP.Movie_Price * 1.10) 
     FROM Transaction_Details TD
     JOIN Movie M ON TD.Movie_ID = M.Movie_ID
     JOIN Movie_Price MP ON M.Movie_Price_ID = MP.Movie_Price_ID
    ),2) AS Earnings,
    (SELECT COUNT(*) FROM Customer) AS Total_Customers,
    (SELECT COUNT(*) FROM Movie) AS Total_Movies,
    (SELECT COUNT(*) FROM Transaction_Details) AS Total_Transactions;`,
    GET_RENTAL_STATUS_SUMMARY: `SELECT 
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
    ) AS Not_Renting_Customers;`
};
