const express = require("express");
const acronymController = require("../../controllers/acronym.controller");

const router = express.Router();

router
  .route("/")
  .get(acronymController.getFilteredAcronyms)
  .post(acronymController.addNewAcronym);

router
  .route("/:acronym")
  .get(acronymController.getAcronymDefinition)
  .put(acronymController.updateOneAcronym)
  .delete(acronymController.deleteOneAcronym);

module.exports = router;
