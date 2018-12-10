const config = require('config');
const express = require('express');
const app = express();
const port = config.get('LP.port');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const controller = require("./controller");
const morgan = require('morgan');

app.use(morgan('dev'));

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50000mb' }));
app.use(bodyParser.urlencoded({ limit: '50000mb', extended: true }));

app.get('/', (req, res) => res.status(200).json({ message: "Welcome To LP-Cloud" }));

app.get('/swi/db', controller.getPl);
app.post('/swi/db', controller.addPl);
app.delete('/swi/db', (req, res) => controller.arPl(req, res, "-r"));

app.post('/swi/solve/:count?', controller.solvePl);

app.listen(port, () => console.log(`LP listening on port ${port}!`));
