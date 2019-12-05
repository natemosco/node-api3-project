const express = require("express"); // importing a CommonJS module
const helmet = require("helmet"); //<<<<security package import

const postRouter = require("./posts/postRouter");
const usersRouter = require("./users/userRouter");

//define custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next();
}

const middleware = [helmet(), express.json(), logger];

//declare your server
const server = express();
//assign global middleware to endpoints
server.use("api/user", middleware, usersRouter);
server.use("api/post", middleware, postRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
