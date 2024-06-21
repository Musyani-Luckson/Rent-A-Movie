const DB_connection = require(`../DB_Connection`);
const bcrypt = require(`bcrypt`);
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
//
const maxAge = 7 * 24 * 60 * 60;
const createToken = (email) => {
    return jwt.sign({ email }, process.env.SECRET_FOR_JWT, {
        expiresIn: maxAge
    })
}
// 
const pages = `../Public`
// 
module.exports.get_admin_signup = async (req, res) => {
    res.sendFile('signup.html', {
        root: path.join(__dirname, `${pages}`)
    }, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}
// 
module.exports.get_admin_signin = async (req, res) => {
    res.sendFile('signin.html', {
        root: path.join(__dirname, `${pages}`)
    }, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}
// 
module.exports.new_admin_signup = async (req, res) => {
    const { first_name, last_name, email, password, comfirm } = req.body;
    const connection = await DB_connection();
    const checkEmailQuery = 'SELECT email FROM Admin WHERE email = ?';
    connection.query(checkEmailQuery, [email], async (error, results) => {
        if (error) {
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            return res.status(400).send({
                error: {
                    message: `Already in use.`,
                    target: `email`
                }
            });
        } else {
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
                    condition: !password, message: {
                        message: 'Password is required.',
                        target: `password`
                    }
                },
                {
                    condition: password && password.length < 8, message: {
                        message: 'Password must be at least 8 characters long.',
                        target: `password`
                    }
                },
                {
                    condition: !comfirm, message: {
                        message: 'Comfirm password is required.',
                        target: `comfirm`
                    }
                },
                {
                    condition: comfirm && comfirm.length < 8, message: {
                        message: 'Comfirm password must be at least 8 characters long.',
                        target: `comfirm`
                    }
                },
                {
                    condition: password !== comfirm, message: {
                        message: 'Comfirmed password wrong',
                        target: `password`
                    }
                }
            ];

            for (let i = 0; i < validations.length; i++) {
                if (validations[i].condition) {
                    return res.status(400).json({
                        error: validations[i].message
                    });
                }
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
                        results
                    };
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, secure: true });
                    // res.send('Token created and cookie set');
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
            return res.status(400).json({
                error: {
                    message: errorMsg,
                    target: `email`
                }
            });
        } else if (password == '' || password == null || password == undefined) {
            const errorMsg = 'Password is required.';
            return res.status(400).json({
                error: {
                    message: errorMsg,
                    target: `password`
                }
            });
        } else if (password.length < 8) {
            const errorMsg = 'Password must be at least 8 characters long.';
            return res.status(400).json({
                error: {
                    message: errorMsg,
                    target: `password`
                }
            });
        }
        if (results.length === 0) {
            return res.status(400).json({
                error: {
                    message: 'Email not found',
                    target: `email`
                }
            });
        }
        const hashedPassword = results[0].Password;
        // Compare the input password with the stored hashed password
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            if (isMatch) {
                const token = createToken(email);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                const response = {
                    success: true,
                    email,
                    // redirect: process.env.ORIGIN
                }
                // res.send('Token created and cookie set');
                res.json(response);
                // res.status(200).json(response)
                // const url = `${process.env.ORIGIN}`;
                // res.redirect(301, url);
            } else {
                return res.status(400).json({
                    error:
                    {
                        message: 'Password is incorrect.',
                        target: `password`
                    }
                });
            }
        });
    })
}
// 
module.exports.old_customer_signin = async (req, res) => {
    const { phone_number } = req.body;
    const connection = await DB_connection();
    const check_Phone = 'SELECT * FROM Customer WHERE Phone_Number = ?';
    connection.query(check_Phone, [phone_number], async (error, results) => {
        if (error) {
            return res.status(500).send('Internal Server Error');
        }
        // 
        if (phone_number == '' || phone_number == null || phone_number == undefined) {
            const errorMsg = 'Phone number is required.';
            return res.status(400).json({
                error: {
                    message: errorMsg,
                    target: `phone_number`
                }
            });
        }
        if (results.length === 0) {
            return res.status(400).json({
                error: {
                    message: 'Phone number not found',
                    target: `phone_number`
                }
            });
        }
        const token = createToken(phone_number);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        const response = {
            success: true,
            phone_number,
        }
        res.json(response);
    })
}