require('dotenv').config({ path: './config.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

var app = express();
const port = process.env.PORT || 8080;
app.use(express.json()); 
app.use(cors());

/* Heroku deploy */
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  }, function (err, res) {
      if (err) {
      console.log (err);
      } else {
      console.log ('Successfully connected to MongoDB!');
      }
    }
  );

routes(app);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
