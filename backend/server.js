require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Tirex API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Tirex backend is healthy"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
 console.log(`Tirex server running on http://localhost:${PORT}`);
})