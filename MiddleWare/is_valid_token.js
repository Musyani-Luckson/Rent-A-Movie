const jwt = require(`jsonwebtoken`);
// 
const myToken = (req, res, callback) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_FOR_JWT, async (error, decodedToken) => {
            if (!error) {
                return callback({ token: decodedToken })
            }
            else {
                return callback({ error: null })
            }
        })
    } else {
        return callback({ error: null })
    }
}

function clearCookie(res, cookieName) {
    res.cookie(cookieName, ``, { expires: new Date(0) });
}
module.exports = { myToken, clearCookie };