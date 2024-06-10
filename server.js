const express = require(`express`);
const app = express();
require(`dotenv`).config();

// Routes
const auth_routes = require(`./Routes/auth_routes`);
const rent_a_movie_routes = require(`./Routes/rent_a_movie_routes`);

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// 
// const cors = require(`cors`);
// const setCors = {
//     origin: process.env.ORIGIN,
//     credentials: true,
// }
// app.use(cors(setCors))
// const cookieParser = require(`cookie-parser`);
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.static(`Frontend`));
// 
// Server is awake and always listening.
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT: [ ${PORT} ].`);
});
// ...
app.use(auth_routes);
app.use(rent_a_movie_routes);