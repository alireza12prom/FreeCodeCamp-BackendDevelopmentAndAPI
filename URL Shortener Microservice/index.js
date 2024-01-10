const table = new Map();

const validurl = require("valid-url");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({ optionsSuccessStatus: 200 }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", function (req, res) {
  let { url } = req.body;

  if (!validurl.isWebUri(url)) {
    res.json({ error: "invalid url" });
    return;
  }

  // make a hash of url
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash += url.charCodeAt(i);
  }

  // add to table
  table.set(`${hash}`, url);

  res.json({ original_url: url, short_url: hash });
});

app.get("/api/shorturl/:short_url", (req, res, next) => {
  let url = table.get(req.params.short_url);
  res.redirect(301, url);
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on port ${listener.address().port}`);
});
