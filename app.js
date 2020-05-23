const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

const userRouter = require('./routes/user');
const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRouter);
app.use(errorController.setErrorPage);

app.listen(3000);
