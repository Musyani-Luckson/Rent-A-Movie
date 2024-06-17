const express = require(`express`);
const app = express();
require(`dotenv`).config();
const path = require('path');
const cors = require('cors');
setCors = {
    origin: process.env.ORIGIN,
    credentials: true,
}
app.use(cors(setCors))
// Routes
const auth_routes = require(`./Routes/auth_routes`);
const rent_a_movie_routes = require(`./Routes/rent_a_movie_routes`);

app.use(express.static(`Public`));

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Server is awake and always listening.
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT: [ ${PORT} ].`);
});
// 
app.get("/", (req, res) => {
    res.sendFile(`./index.html`, {
        root: __dirname
    })
})
// ...
app.use(auth_routes);
app.use(rent_a_movie_routes);