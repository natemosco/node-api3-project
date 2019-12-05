const express = require("express"); // this means import

const router = express.Router();

const userData = require("./userDb");
const postData = require("../posts/postDb");

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
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ errorMessage: "missing user data" });
  } else if (req.body && req.body.name) {
    next();
  } else {
    res.status(400).json({ errorMessage: "missing required name field" });
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
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
    .then(allUsers => {
      res.status(200).json(allUsers);
    })
    .catch(error => {
      console.log(error, "GET / error");
      res.status(500).json({ errorMessage: "internal error fetching users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  userData
    .getById(id)
    .then(singleUser => {
      userData.get().then(allUsers => {
        res.status(200).json({ userRequested: singleUser, allUsers: allUsers });
      });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  userData
    .getUserPosts(id)
    .then(specifiedUserPosts => {
      res.status(200).json(specifiedUserPosts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage:
          "The post information for this user could not be retrieved."
      });
    });
});

router.post("/", validateUser, (req, res) => {
  userData
    .insert(req.body)
    .then(createdUser => {
      res.status(201).json(createdUser);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The user could not be created in the database."
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  postData
    .insert(req.body)
    .then(postToSpecificUserId => {
      res.status(201).json(postToSpecificUserId);
    })
    .catch(error => {
      console.log(error, "ERROR: POST /:id/posts");
      res.status(500).json({
        errorMessage:
          "The post could not be added to specified user in database."
      });
    });
});

router.delete("/:id", (req, res) => {
  userData
    .remove(req.params.id)
    .then(
      userData.getById(req.params.id).then(user => {
        userData.get().then(allUsers => {
          res.status(201).json({ deletedUser: user, allUsers: allUsers });
        });
      })
    )
    .catch(error => {
      console.log(error, "ERROR: Delete /:id/");
      res.status(500).json({
        errorMessage: "Error, user could not be removed."
      });
    });
});

router.put("/:id", (req, res) => {});

module.exports = router;
