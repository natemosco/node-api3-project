const express = require("express"); // this means import

const router = express.Router();

const userData = require("./userDb");

//custom middleware
//here because even though hoisting is a thing it still makes more sense to declare something before using it whenever possible

function validateUserId(req, res, next) {
  const id = req.params.id;
  userData
    .getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ errorMessage: "invalid user id" });
      }
    })
    .catch(error => {
      console.log(error, "validateUserId error");
      res
        .status(500)
        .json({ errorMessage: "validateUserId internal middleware error" });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ errorMessage: "missing user data" });
  } else if (req.body && req.body.name) {
    next();
  } else {
    res.status(400).json({ errorMessage: "missing required name field" });
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ errorMessage: "missing post data" });
  } else if (req.body && !req.body.text) {
    res.status(400).json({ errorMessage: "missing required text field" });
  } else {
    next();
  }
}

// Declare the use of the middleware either locally or globally

// endpoints
router.get("/", (req, res) => {
  userData
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error, "GET / error");
      res.status(500).json({ errorMessage: "internal error fetching users" });
    });
});

router.get("/:id", (req, res) => {});

router.get("/:id/posts", (req, res) => {});

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

module.exports = router;
