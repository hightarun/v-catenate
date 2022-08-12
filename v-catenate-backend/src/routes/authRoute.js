const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

const app = express();

//helmet for security
const helmet = require("helmet");
app.use(helmet());

const auth = require("../middlewares/auth");
// const validation = require("../middlewares/validation");

//const { checkLogin } = require("../utils/validationChecks");

//@route GET /api/auth
router.get("/", auth, authController.getLogin);

// @route POST /api/auth
router.post("/", authController.postLogin);

module.exports = router;
