const express = require("express"),
  morgan = require("morgan"),
  cookieSession = require("cookie-session"),
  bodyParser = require("body-parser");

const keys = require("./config/keys");
const errorHandlers = require("./handlers/error");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.COOKIE_KEY]
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

require("./services/passport")(app);
require("./routes/account")(app);
require("./routes/poll")(app);

app.use(errorHandlers);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log(`Server starting on ${PORT}`);
});

//testing
module.exports = app;
