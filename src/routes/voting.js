const express = require("express");
const { session } = require("../db");
const router = express.Router();

// API to Add a Voter
router.post("/add-voter", async (req, res) => {
  const { voterId, name } = req.body;

  try {
    const result = await session.run(
      "CREATE (v:Voter {voterId: $voterId, name: $name}) RETURN v",
      { voterId, name }
    );

    const createdVoter = result.records[0].get("v").properties;
    res
      .status(201)
      .json({ message: "Voter added successfully", voter: createdVoter });
  } catch (error) {
    res.status(500).json({ message: "Error adding voter", error });
  }
});

module.exports = router;
