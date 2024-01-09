var cors = require("cors");
var express = require("express");

var app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:date?", (req, res, next) => {
  let { date } = req.params;
  let unix;

  if (!date) {
    unix = new Date().getTime();
  } else if (new Date(date) != "Invalid Date") {
    unix = new Date(date).getTime();
  } else if (new Date(+date) != "Invalid Date") {
    unix = new Date(+date).getTime();
  } else {
    return res.json({ error: "Invalid Date" });
  }

  res.json({ unix, utc: new Date(unix).toUTCString() });
});

var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
