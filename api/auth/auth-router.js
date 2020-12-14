const router = require("express").Router();
const jwt = require("jsonwebtoken");
const secret = require("../../secret");
const bcryptjs = require("bcryptjs");
const users = require("../users/users-model");
const { isValid } = require("../auth/service");

router.post("/register", async (req, res) => {
  const cred = req.body;
  try {
    if (isValid(cred)) {
      const rounds = process.env.BCRYPT_ROUNDS || 8;
      const hash = bcryptjs.hashSync(cred.password, rounds);
      cred.password = hash;
      const user = await users.add(cred);
      const token = generateToken(user);
      res.status(201).json({ data: cred, token });
    } else {
      res.status(400).json({ message: "username and password required" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Username already exists" });
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  try {
    const user = await users.findBy({ username }).first();

    if (user && bcryptjs.compareSync(password, user.password)) {
      const token = generateToken({ username, password });
      res
        .status(200)
        .json({ Message: `Welcome, ${user.username}`, token: token });
    } else {
      res.stutus(400).json("Username and password required!!!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("invalid credentials ");
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

const generateToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, secret.jwtSecret, options);
};

module.exports = router;
