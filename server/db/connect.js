const mongoose = require("mongoose");
const connect = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true, // autoIndex: true in connect.js  to work
  });
};
module.exports = { connect };
