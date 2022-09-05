const User = require("../models/User");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

module.exports.getLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -email  -phone"
    );

    res.json(user);
  } catch (err) {
    //console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// login and send token
module.exports.postLogin = async (req, res) => {
  //destructring request body
  //const {  emailOrUname, password} = req.body;
  try {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      String(req.body.emailOrUname).toLowerCase()
    );
    let user;
    if (regexEmail) {
      user = await User.findOne({ email: req.body.emailOrUname });
    } else {
      user = await User.findOne({ username: req.body.emailOrUname });
    }

    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    //check if user confirmed email
    if (!user.isVerified) {
      return res.status(400).json({
        errors: [{ msg: "Please verify your email before loging in" }],
      });
    }

    //matching the password with hashed password in user database
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    //user id as payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    //jwt signing the user id and sending the token as json
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 86400 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Registering new USER
module.exports.postSignup = async (req, res) => {
  //destructring request body
  //const {  utype, uname ,fName, lName, email, password, phone } = req.body;
  try {
    //checking if username is valid
    const regex = /^[a-z_]+([._]?[a-zA-Z0-9]+)*$/;
    if (!req.body.uname.match(regex)) {
      return res.status(400).json({ errors: [{ msg: "Invalid username" }] });
    }

    //checking if username already exists
    let u = await User.findOne({ username: req.body.uname });
    if (u) {
      return res
        .status(409)
        .json({ errors: [{ msg: "Username already exists" }] });
    }

    Array.prototype.contains = function (obj) {
      return this.indexOf(obj) > -1;
    };

    //checking if email already exists
    let e = await User.findOne({ email: req.body.email });
    if (e) {
      return res
        .status(409)
        .json({ errors: [{ msg: "E-mail already exists" }] });
    }

    let user = new User({
      username: req.body.uname,
      companyName: req.body.companyName,
      email: req.body.email,
      password: req.body.password,
    });

    //Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();

    //user id as payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.E_ID,
        pass: process.env.PSWD,
      },
    });

    //jwt signing the user id

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 86400 },
      (err, token) => {
        if (err) throw err;

        //send confirmation email
        const confirmationUrl = `${process.env.BASE_URL}/api/confirmation/${token}`;
        let mailOptions = {
          from: `"FACEGES" <${process.env.E_ID}>`,
          to: req.body.email,
          subject: "Email Verification for Faceges",
          text: `Hi ${req.body.companyName}, please confirm your email
                 by clicking on the link.`,
          html: `<h2>Hi, ${req.body.companyName}</h2>
                 <br/>
                 <p>Thank you for registering</p>
                 <br/>
                 <p>Please click here to verify your Email</p>
                 <h1><a href="${confirmationUrl}">here</a></h1>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res
              .status(400)
              .json({ errors: [{ msg: "Cofirmation Email not send" }] });
          }
        });

        res.send(
          "User Registered Successfully, Please verify your email to login"
        );
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
