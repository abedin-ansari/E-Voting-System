const express = require("express");
const cors = require("cors");
const votingRoutes = require("./routes/voting");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Routes
app.use("/api/voting", votingRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
