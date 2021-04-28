const mongoose = require("mongoose");
const logger = require("../config/winston");

const connectMongoDB = () => {
  mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    dbName: "fantasy-baseball",
  });

  const db = mongoose.connection;
  db.on("error", (err) => logger.error(`DB connection Error : \n${err}`));
  db.once("open", () => logger.info("Connected"));
};

module.exports = connectMongoDB;
