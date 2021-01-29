const httpStatus = require("http-status");
const fs = require("fs");
const path = require("path");

const jsonDB = "../data/db.json";

const getRandomCount = async (req, res) => {
  try {
    const acronym = req.params.acronym;

  } catch (err) {
    console.log({ err });
    res.status(httpStatus.SERVER_ERROR).send({ message: "An error occurred" });
  }
};

module.exports = {
  getRandomCount,
};
