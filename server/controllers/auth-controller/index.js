require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};

const registerUser = async (req, res) => {
  console.log(req.body);
  const { userName, userEmail, password, role } = req.body;
  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "UserName or User Email already exist",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userEmail,
    role,
    password: hashPassword,
  });

  await newUser.save();

  return res.status(201).json({
    success: "true",
    message: "User registered successfully!",
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginUser = async (req, res) => {
  function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "45m",
    });
  }
  function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return refreshToken;
  }

  const { userEmail, password } = req.body;
  const doUserExist = await User.findOne({ userEmail });
  if (!(await bcrypt.compare(password, doUserExist.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }
  if (!doUserExist) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }
  // } else {
  //   await User.updateOne(
  //     { userEmail },
  //     {
  //       $set: {
  //         refreshToken: `${generateRefreshToken({
  //           _id: doUserExist._id,
  //           userName: doUserExist.userName,
  //           userEmail: doUserExist.userEmail,
  //           role: doUserExist.role,
  //         })}`,
  //       },
  //     }
  //   );
  // }

  const accessToken = generateAccessToken({
    _id: doUserExist._id,
    userName: doUserExist.userName,
    userEmail: doUserExist.userEmail,
    role: doUserExist.role,
  });

  const refreshToken = generateRefreshToken({
    _id: doUserExist._id,
    userName: doUserExist.userName,
    userEmail: doUserExist.userEmail,
    role: doUserExist.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Make it secure
    secure: process.env.NODE_ENV === "production", // Send over HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "Strict", // CSRF protection
  });

  // const accessToken = jwt.sign(
  //   {
  //     _id: doUserExist._id,
  //     userName: doUserExist.userName,
  //     userEmail: doUserExist.userEmail,
  //     role: doUserExist.role,
  //   },
  //   process.env.ACCESS_TOKEN_SECRET,
  //   { expiresIn: "120m" }
  // );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: doUserExist._id,
        userName: doUserExist.userName,
        userEmail: doUserExist.userEmail,
        role: doUserExist.role,
      },
    },
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Please Login, No refresh token found" });
  }
  try {
    const payload = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(payload);
    const { iat, exp, ...refreshTokenPayload } = payload;
    const newAccessToken = jwt.sign(
      refreshTokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "45m",
      }
    );
    res.json({ accessToken: newAccessToken });
    console.log("New AccessToken Sent");
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = { registerUser, loginUser, refresh };
