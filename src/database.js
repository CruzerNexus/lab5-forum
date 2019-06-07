const mongoose = require('mongoose');

const databaseString = () => {
  if(process.env.ENV === "test"){
    return "mongodb://localhost:27017/lab4-forum-test";
  } else {
    return "mongodb://localhost:27017/lab4-forum";
  }
};

const connectDatabase = () => {
  mongoose.connect(databaseString(),{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });

  console.log('Connected to database...');

  mongoose.connection.on('error', (err) => {
    console.error(err);
    process.exit(-1);
  });
};

module.exports = {
  connectDatabase,
};