var cors = require("cors");
var express = require("express");
var app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/whoami", function (req, res) {
  res.json({
    ipaddress: req.socket.remoteAddress,
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
