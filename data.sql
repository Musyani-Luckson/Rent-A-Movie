SELECT 
            t.Transaction_ID,
    CONCAT(c.First_Name, ' ', IFNULL(c.Middle_Name, ''), ' ', c.Last_Name) AS Customer_Name,
    COUNT(td.Movie_ID) AS Movies,
    ROUND(SUM(mp.Movie_Price), 2) AS Movie_Total,
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
    t.Transaction_Date DESC;