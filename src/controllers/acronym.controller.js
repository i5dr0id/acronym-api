const httpStatus = require("http-status");
const fs = require("fs");
const path = require("path");

const jsonDB = "../data/db.json";

// getAcronymDefinition
const getFilteredAcronyms = async (req, res) => {
  try {
    // request query parameter
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search.toLocaleLowerCase() || "";
    let result = [];

    if ((from || from === 0) && limit && search) {
      // read flat file DB
      const rawJSONdata = fs.readFileSync(path.join(__dirname, jsonDB));
      let obj = JSON.parse(rawJSONdata);

      //fuzzy match logic
      obj = obj.filter((element) =>
        Object.keys(element)[0].toLocaleLowerCase().includes(search)
      );

      obj = obj.slice(from, from + limit);
      result = obj;

      res
        .status(httpStatus.OK)
        .send({ message: "World Texting Foundation API", data: result });
    } else {
      res.status(httpStatus.OK).send({
        message:
          "Enter values for 'from', 'limit' and 'search' in query parameter",
      });
    }
  } catch (err) {
    console.log({ err });
    res.status(httpStatus.SERVER_ERROR).send({ message: "An error occurred" });
  }
};

const getAcronymDefinition = async (req, res) => {
  try {
    const acronym = req.params.acronym;
    let result = [];
    if (acronym) {
      // read flat file DB
      const rawJSONdata = await fs.readFileSync(path.join(__dirname, jsonDB));
      let obj = JSON.parse(rawJSONdata);
      obj = obj.filter(
        (element) =>
          Object.keys(element)[0].toLocaleLowerCase() ===
          acronym.toLocaleLowerCase()
      );
      result = obj;
      res
        .status(httpStatus.OK)
        .send({ message: "Matching acronym definition", data: result });
    } else {
      res.status(httpStatus.OK).send({ message: "Missing acronym" });
    }
  } catch (err) {
    console.log({ err });
    res.status(httpStatus.SERVER_ERROR).send({ message: "An error occurred" });
  }
};

const addNewAcronym = async (req, res) => {
  try {
    const newAcronymObj = req.body;
    let result = [];

    if (newAcronymObj) {
      // read flat file DB
      const rawJSONdata = await fs.readFileSync(path.join(__dirname, jsonDB));
      let obj = JSON.parse(rawJSONdata);
      const checkIfAcronymExist = obj.filter(
        (element) =>
          Object.keys(element)[0].toLocaleLowerCase() ===
          Object.keys(newAcronymObj)[0].toLocaleLowerCase()
      );
      if (!checkIfAcronymExist.length) {
        result = [...obj, newAcronymObj];
        let data = JSON.stringify(result);
        //Write to flat file
        await fs.writeFileSync(path.join(__dirname, jsonDB), data);
        res
          .status(httpStatus.OK)
          .send({ message: "Matching acronym definition", data: result });
      } else {
        res
          .status(httpStatus.OK)
          .send({ message: "Acronym definition already exist, try update" });
      }
    } else {
      res.status(httpStatus.OK).send({ message: "Missing acronym" });
    }
  } catch (err) {
    console.log({ err });
    res.status(httpStatus.SERVER_ERROR).send({ message: "An error occurred" });
  }
};

const updateOneAcronym = async (req, res) => {
  try {
    let newAcronymObj = req.params.acronym;
    let result = [];

    // validate obj later
    if (newAcronymObj) {
      const rawJSONdata = await fs.readFileSync(path.join(__dirname, jsonDB));
      let obj = JSON.parse(rawJSONdata);
      newAcronymObj = JSON.parse(newAcronymObj);

      const updatedAcronym = obj.filter((element) => {
        if (
          Object.keys(element)[0].toLocaleLowerCase() ===
          Object.keys(newAcronymObj)[0].toLocaleLowerCase()
        ) {
          // update acronym definition logic
          element[Object.keys(element)[0]] =
            newAcronymObj[Object.keys(newAcronymObj)[0]];
          return element;
        }
      });

      if (updatedAcronym && updatedAcronym.length) {
        result = [...obj];
        let data = JSON.stringify(result);
        //Write to flat file
        await fs.writeFileSync(path.join(__dirname, jsonDB), data);
        res.status(httpStatus.OK).send({
          message: "Updated Acronym definition",
          data: updatedAcronym,
        });
      } else {
        res
          .status(httpStatus.OK)
          .send({ message: "Acronym definition does not exist" });
      }
    } else {
      res.status(httpStatus.OK).send({ message: "Missing acronym" });
    }
  } catch (err) {
    console.log({ err });
    res.status(httpStatus.SERVER_ERROR).send({ message: "An error occurred" });
  }
};

const deleteOneAcronym = async (req, res) => {
  try {
    let acronymID = req.params.acronym;
    let result = [];

    if (acronymID) {
      const rawJSONdata = await fs.readFileSync(path.join(__dirname, jsonDB));
      let obj = JSON.parse(rawJSONdata);

      const acronymObjIndex = obj.findIndex(
        (element) =>
          Object.keys(element)[0].toLocaleLowerCase() ===
          acronymID.toLocaleLowerCase()
      );
      console.log(acronymObjIndex);
      if (acronymObjIndex > -1) {
        obj.splice(acronymObjIndex, 1);
        result = [...obj];
        let data = JSON.stringify(result);
        await fs.writeFileSync(path.join(__dirname, jsonDB), data);
        res.status(httpStatus.OK).send({
          message: "Deleted Acronym",
        });
      } else {
        res.status(httpStatus.OK).send({
          message: "Acronym does not exist",
        });
      }
    }
  } catch (err) {
    console.log({ err });
    res.status(httpStatus.SERVER_ERROR).send({ message: "An error occurred" });
  }
};

module.exports = {
  getFilteredAcronyms,
  getAcronymDefinition,
  addNewAcronym,
  updateOneAcronym,
  deleteOneAcronym,
};
