const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(cors());

const receivedFolder = path.join(__dirname, "received");
if (!fs.existsSync(receivedFolder)) {
  fs.mkdirSync(receivedFolder);
}

app.post("/upload", (req, res) => {
  const fileName = req.headers["file-name"];
  req.on("data", (chunk) => {
    const filePath = path.join(receivedFolder, fileName);
    fs.appendFileSync(filePath, chunk);
    console.log(`received chunk! ${chunk.length}`);
  });
  res.end("Uploaded!");
});

app.get("/complete", () => {
  console.log("Upload Complete");
});

app.listen(3001, () => {
  console.log("Server running on port 3001...");
});
