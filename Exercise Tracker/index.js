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
const users = {};
const exercises = {};

app.post("/api/users", (req, res, next) => {
  const { username } = req.body;

  const id = crypto.randomBytes(14).toString("hex");
  users[id] = { _id: id, username };

  res.json(users[id]);
});

app.get("/api/users", (req, res, next) => {
  res.json(Object.values(users));
});

app.post("/api/users/:_id/exercises", (req, res, next) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  // check user exists
  if (!users[_id]) {
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

  if (!parseInt(duration)) {
    return res
      .status(500)
      .json({ msg: "description: Path `duration` is not a valid number." });
  }

  if (date && new Date(date) == "Invalid Date") {
    return res
      .status(500)
      .json({ msg: "description: Path `date` is not a valid date." });
  }

  // add exercise
  if (!exercises[_id]) {
    exercises[_id] = [];
  }

  const exercise = {
    description,
    duration: +duration,
    date: date || new Date(Date.now()).toISOString().substring(0, 10),
  };

  exercises[_id].push(exercise);

  res.json({
    ...exercise,
    ...users[_id],
    date: new Date(exercise.date).toDateString(),
  });
});

app.get("/api/users/:_id/logs", (req, res, next) => {
  let { _id } = req.params;
  let { limit, from, to } = req.query;

  // check user exists
  if (!users[_id]) {
    return res
      .status(500)
      .json({ msg: "description: Path `_id` is not found." });
  }

  let user = users[_id];
  let userExercises = [...exercises[_id]];

  // from & to
  from =
    from && new Date(from) != "Invalid Date"
      ? from
      : new Date(0).toISOString().substring(0, 10);

  to =
    to && new Date(to) != "Invalid Date"
      ? to
      : new Date(Date.now()).toISOString();

  userExercises = userExercises.filter((ex) => {
    console.log(ex);
    return (
      new Date(ex.date) >= new Date(from) && new Date(ex.date) <= new Date(to)
    );
  });

  // apply limit
  if (parseInt(limit)) {
    userExercises = userExercises.slice(0, limit);
  }

  // convert data to date string
  userExercises = userExercises.map((ex) => ({
    ...ex,
    date: new Date(ex.date).toDateString(),
  }));

  res.json({ ...user, count: userExercises.length, log: userExercises });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
