const DB_connection = require(`../DB_Connection`);
const bcrypt = require(`bcrypt`);
const jwt = require('jsonwebtoken');
const path = require('path');
//
const maxAge = 7 * 24 * 60 * 60;
const createToken = (email) => {
    return jwt.sign({ email }, process.env.SECRET_FOR_JWT, {
        expiresIn: maxAge
    })
}
// 
const pages = `../public`
// 
module.exports.get_admin_signup = async (req, res) => {
    res.sendFile(path.join(__dirname, `${pages}/signup.html`), (err) => {
        if (err) {
            res.status(500).send("Server error");
        }
    });
}
// 
module.exports.get_admin_signin = async (req, res) => {
    res.sendFile(path.join(__dirname, `${pages}/signin.html`), (err) => {
        if (err) {
            res.status(500).send("Server error");
        }
    });
}
// 
module.exports.new_admin_signup = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const connection = await DB_connection();
    const checkEmailQuery = 'SELECT email FROM Admin WHERE email = ?';
    connection.query(checkEmailQuery, [email], async (error, results) => {
        if (error) {
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            return res.status(400).send(`[ ${email} ] is already in use.`);
        } else {
            // Validate input before proceeding with the database query
            if (first_name == '' || first_name == null || first_name == undefined) {
                const errorMsg = 'Firstname is required.';
                return res.status(400).json({ error: errorMsg });
            } else if (last_name == '' || last_name == null || last_name == undefined) {
                const errorMsg = 'Lastname is required.';
                return res.status(400).json({ error: errorMsg });
            } else if (email == '' || email == null || email == undefined) {
                const errorMsg = 'Email is required.';
                return res.status(400).json({ error: errorMsg });
            } else if (password == '' || password == null || password == undefined) {
                const errorMsg = 'Password is required.';
                return res.status(400).json({ error: errorMsg });
            } else if (password.length < 8) {
                const errorMsg = 'Password must be at least 8 characters long.';
                return res.status(400).json({ error: errorMsg });
            }
            // Proceed with the database query if validation passes
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            // 
            const INSERT_ADMIN_QUERY = `INSERT INTO Admin SET ?`
            const ADMIN = {
                first_name,
                last_name,
                email,
                password: hash
            }
            // 
            connection.query(INSERT_ADMIN_QUERY, ADMIN, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred while creating the admin.' });
                } else {
                    const token = createToken(email);
                    const response = {
                        email,
                        results,
                        token
                    };
                    res.status(201).json(response);
                }
            });
        }
    })
}
// 
module.exports.old_admin_signin = async (req, res) => {
    const { email, password } = req.body;
    const connection = await DB_connection();
    const checkEmailQuery = 'SELECT * FROM Admin WHERE email = ?';
    connection.query(checkEmailQuery, [email], async (error, results) => {
        if (error) {
            // console.error('Error executing query:', error);
            return res.status(500).send('Internal Server Error');
        }
        // 
        if (email == '' || email == null || email == undefined) {
            const errorMsg = 'Email is required.';
            return res.status(400).json({ error: errorMsg });
        } else if (password == '' || password == null || password == undefined) {
            const errorMsg = 'Password is required.';
            return res.status(400).json({ error: errorMsg });
        } else if (password.length < 8) {
            const errorMsg = 'Password must be at least 8 characters long.';
            return res.status(400).json({ error: errorMsg });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'Email is incorrect.' });
        }
        const admin = results[0];
        const hashedPassword = admin.Password;
        // Compare the input password with the stored hashed password
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            if (isMatch) {
                const token = createToken(email);
                const response = {
                    email,
                    token,
                    Logged: true
                }
                res.status(200).json(response)
            } else {
                return res.status(400).json({ error: 'Password is incorrect.' });
            }
        });
    })
}

