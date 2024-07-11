const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors());

app.post("/upload", (req, res) => {
  const fileName = req.headers["file-name"];
  req.on("data", (chunk) => {
    fs.appendFileSync(fileName, chunk);
    console.log(`received chunk! ${chunk.length}`);
  });
  res.end("Uploaded!");
});

app.listen(3001, () => {
  console.log("Server running on port 3001...");
});
