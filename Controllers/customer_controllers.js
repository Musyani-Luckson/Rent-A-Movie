
const DB_connection = require(`../DB_Connection`);

module.exports.customer_movies = async (req, res) => {

    const connection = await DB_connection();
    const SQL = `SELECT 
    m.Movie_Id AS ID,
    m.Movie_Title AS Title,
    mt.Movie_Type_Name AS Type,
    mp.Movie_Price AS Price,
    ROUND(mp.Movie_Price*et.Tax_Value,2) AS Tax,
    ROUND(mp.Movie_Price + mp.Movie_Price*et.Tax_Value,2) AS Total,
    GROUP_CONCAT(CONCAT(a.First_Name, ' ', IFNULL(a.Middle_Name, ''), ' ', a.Last_Name) SEPARATOR ', ') AS Actors
FROM 
    Movie m
JOIN 
    Movie_Type mt ON m.Movie_Type_ID = mt.Movie_Type_ID
JOIN 
    Movie_Price mp ON m.Movie_Price_ID = mp.Movie_Price_ID
JOIN 
    Entertainment_Tax et ON mp.Tax_ID = et.Tax_ID
LEFT JOIN 
    Movie_Cast mc ON m.Movie_ID = mc.Movie_ID
LEFT JOIN 
    Actor a ON mc.Actor_ID = a.Actor_ID
GROUP BY 
    m.Movie_ID, m.Movie_Title, mt.Movie_Type_Name, mp.Movie_Price, et.Tax_Value
ORDER BY 
    m.Movie_Title;`;
    connection.query(SQL, async (error, results) => {
        res.send(results);
    })
}


module.exports.customer_transactions = async (req, res) => {
    const key = Object.keys(req.query)[0];
    let value = req.query[key];
    const SQL = `SELECT 
    t.Transaction_ID,
    t.Transaction_Date,
    m.Movie_Title AS Title,
    mt.Movie_Type_Name AS Type,
    mp.Movie_Price AS Price,
    ROUND(mp.Movie_Price*et.Tax_Value,2) AS Tax,
    ROUND(mp.Movie_Price + mp.Movie_Price*et.Tax_Value,2) AS Total
FROM 
    Transaction t
JOIN 
    Transaction_Details td ON t.Transaction_ID = td.Transaction_ID
JOIN 
    Movie m ON td.Movie_ID = m.Movie_ID
JOIN 
    Movie_Type mt ON m.Movie_Type_ID = mt.Movie_Type_ID
JOIN 
    Movie_Price mp ON m.Movie_Price_ID = mp.Movie_Price_ID
JOIN 
    Entertainment_Tax et ON mp.Tax_ID = et.Tax_ID
WHERE 
    t.${key} = ?
ORDER BY 
    t.Transaction_Date DESC;`;
    const connection = await DB_connection();
    connection.query(SQL, [value], async (error, results) => {
        res.send(results);
    })
}
