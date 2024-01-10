const crypto = require("crypto");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Databases
const users = new Map();
const exercises = new Map();

app.post("/api/users", (req, res, next) => {
  const { username } = req.body;

  const id = crypto.randomBytes(14).toString("hex");
  users.set(id, { _id: id, username });

  res.json(users.get(id));
});

app.get("/api/users", (req, res, next) => {
  res.json(Array.from(users.values()));
});

app.post("/api/users/:_id/exercises", (req, res, next) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  // check user exists
  if (!users.has(_id)) {
    return res
      .status(500)
      .json({ msg: "description: Path `_id` is not found." });
  }

  // validate body
  if (!description) {
    return res
      .status(500)
      .json({ msg: "description: Path `description` is required." });
  }

  if (isNaN(parseInt(duration))) {
    return res
      .status(500)
      .json({ msg: "description: Path `duration` is not a valid number." });
  }

  if (
    date &&
    (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date) ||
      new Date(date) == "Invalid Date")
  ) {
    return res
      .status(500)
      .json({ msg: "description: Path `date` is not a valid date." });
  }

  // add exercise
  if (!exercises.has(_id)) {
    exercises.set(_id, []);
  }

  exercises.get(_id).push({
    description,
    duration,
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  });

  res.json({ ...exercises.get(_id).at(-1), ...users.get(_id) });
});

app.get("/api/users/:_id/logs", (req, res, next) => {
  const { _id } = req.params;
  const { limit, from, to } = req.query;

  // check user exists
  if (!users.has(_id)) {
    return res
      .status(500)
      .json({ msg: "description: Path `_id` is not found." });
  }

  let user = users.get(_id);
  let userExercises = exercises.get(_id);

  //  limit
  let exerciseUser = exercises.get(_id);
  if (parseInt(limit)) {
    exerciseUser = exerciseUser.slice(0, parseInt(limit));
  }

  // from & to
  if (from && new Date(from) != "Invalid Date") {
    exerciseUser = exerciseUser.filter((ex) => {
      return new Date(ex.date) >= new Date(from);
    });
  }

  if (to && new Date(to) != "Invalid Date") {
    exerciseUser = exerciseUser.filter((ex) => {
      return new Date(ex.date) <= new Date(to);
    });
  }

  res.json({ ...user, count: userExercises.length, log: userExercises });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
