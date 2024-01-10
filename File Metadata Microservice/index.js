var cors = require("cors");
var express = require("express");
var fileupload = require("express-fileupload");
var app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post(
  "/api/fileanalyse",
  fileupload({ uploadTimeout: 0 }),
  (req, res, next) => {
    const uploadedFile = req.files["upfile"];

    res.json({
      name: uploadedFile.name,
      type: uploadedFile.mimetype,
      size: uploadedFile.size,
    });
  }
);

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
