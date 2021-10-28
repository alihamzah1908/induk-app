// require('rootpath')();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// const Router = require('./routes/routes.js');
const exphbs = require('express-handlebars');
const cors = require('cors')
const path = require('path');
const jwt = require('jsonwebtoken');
// import db from './models/index.js';
const db = require('./models');
const app = express();
// import bodyParser from 'body-parser';

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });
var corsOptions = {
    origin: 'http://localhost:8081'
}
global.__basedir = __dirname + "/";

app.use(express.json());
app.use(cors(corsOptions))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// const __dirname = path.resolve(path.dirname(''));
app.use(express.static(__dirname + "/public"));
app.engine('hbs', exphbs({
    defaultLayout: 'newmain',
    extname: '.hbs',
}));
// Setting template Engine
app.set('view engine', 'hbs');
require("./routes/routes.js")(app);
require("./routes/api.js")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});