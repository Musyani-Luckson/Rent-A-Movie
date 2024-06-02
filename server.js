const express = require(`express`);
const app = express();
// const cors = require(`cors`);
require(`dotenv`).config();

// const setCors = {
//     origin: process.env.ORIGIN,
//     credentials: true,
// }

// app.use(cors(setCors))
// const cookieParser = require(`cookie-parser`);
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.static(`Frontend`));

const auth_routes = require(`./Routes/auth_routes`);
const rent_a_movie_routes = require(`./Routes/rent_a_movie_routes`);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT: [ ${PORT} ].`);
});

app.use(auth_routes);
app.use(rent_a_movie_routes);