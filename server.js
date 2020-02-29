/* const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
*/


const config = require('./config');
 
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
 
const router = require('./router');
 
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
 
const app = express();
 
// basic configuration
const PUBLIC = path.resolve(__dirname, 'public');
const PORT = config.app.port;
 
// set up database 
mongoose.Promise = global.Promise;
const db = mongoose.connection;
 
db.on('error', err => console.log(err));
db.once('open', () => {
  console.log(`Server started on port ${PORT}`);
});
 
// implement middlewares
app.use(helmet());
app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
 
app.use('/public', express.static(PUBLIC));
 
// implement router
app.use('/api/exercise', router);
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});
 
// mount server
app.listen(PORT, () => {
  mongoose.connect(config.db.mongoURI, { useNewUrlParser: true });
});
 