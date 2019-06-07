const passport = require("passport");
const { Router } = require("express");
const { check, validationResult } = require("express-validator/check");

const Board = require("../models/Board");

const router = Router();

const jwtAuth = passport.authenticate("jwt", { session: false });

const createValidators = [jwtAuth, check(["name"]).exists()];

router.get("/:_id", async (req, res) => {
  const { _id } = req.params;

  const board = await Board.findOne({ _id }).populate("user posts");

  if (board) {
    res.send(board);
  } else {
    res.sendStatus(404);
  }
});

router.post("/", createValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  if (!req.user.admin) {
    return res.sendStatus(401);
  }
  const board = new Board({
    ...req.body,
    user: req.user._id,
  });
  try {
    await board.save();
    res.send(board);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.patch("/:_id", jwtAuth, async (req, res) => {
  const { _id } = req.params;

  const board = await Board.findOne({ _id }).populate('user');


  if (!req.user.admin) {
    return res.sendStatus(401);
  }
  board.set({
    ...req.body,
  });
  await board.save();
  res.send(board);
});

router.delete("/:_id", jwtAuth, async (req, res) => {
  const { _id } = req.params;

  const board = await Board.findOne({ _id }).populate("user");
  if (!req.user.admin) {
    return res.sendStatus(401);
  }
  await board.remove();
  res.send("Board deleted.");
});

router.get("/", async (req, res) => {
  const boards = await Board.find();
  res.send(boards);
});

module.exports = router;
