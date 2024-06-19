const jwt = require(`jsonwebtoken`);
// const path = require(`path`);
const authorise = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_FOR_JWT, (err, decodedToken) => {
            if (err) {
                // login
                const url = `${process.env.ORIGIN}/Pages/signin.html`;
                return res.redirect(301, url);
            } else {
                // continue
                next();
            }
        })
    } else {
        // login
        const url = `${process.env.ORIGIN}/Pages/signin.html`;
        return res.redirect(301, url);
    }
}

// current user
// const checkUser = (req, res, next) => {
//     const token = req.cookies.jwt;
//     if (token) {
//         jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
//             if (!err) {
//                 const { id } = decodedToken
//                 const user = await User.findById(id);
//                 res.locals.user = user
//                 // {
//                 //     fullname: user.fullname,
//                 //     email: user.email,
//                 //     sid: user.sid,
//                 //     id: user._id,
//                 // };
//                 next();
//             } else {
//                 res.locals.user = null;
//                 next();
//             }
//         })
//     } else {
//         res.locals.user = null;
//         next();
//     }
// }

module.exports = { authorise };