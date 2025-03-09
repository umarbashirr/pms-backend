require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const loggerMiddleware = require("./helpers/logger");

const propertyRoutes = require("./routes/property.routes");
const authRoutes = require("./routes/auth.routes");
const roomTypeRoutes = require("./routes/room-type.routes");

const app = express();
const port = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Backend!" });
});

// Routes

app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/properties/:propertyId/room-types", roomTypeRoutes);

app.listen(port, () => {
  console.log(`Server started running on port ${port}...`);
});
