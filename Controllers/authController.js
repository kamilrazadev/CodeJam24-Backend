import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import authModel from "../Models/authModel.js";
import { config } from "dotenv";
import { sendOtp } from "../Middlewares/otp.js";
import otpModel from "../Models/otpModel.js";

const { hash, compare } = bcryptjs;
const { sign, verify } = jsonwebtoken;
config();

const jwtSecret = process.env.JWT_SECRET;

export const verifyAccountSignupController = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(200).json({
        status: false,
        message: "fieldsReq",
        details: "Please provide all fields",
      });
    }

    const userAlreadyExists = await authModel.findOne({ email: email });
    if (userAlreadyExists) {
      return res.status(200).json({
        status: false,
        message: "duplication",
        details: "This email already registered",
      });
    }

    const otpSent = await sendOtp(email);

    if (!otpSent.status) {
      res.status(200).json({
        status: false,
        message: "otpError",
        details: otpSent.message,
        error: otpSent.error,
      });
    }

    const payload = {
      email: email,
      otp: otpSent.otp,
    };

    await otpModel.create(payload);

    return res.status(200).json({
      status: true,
      message: "success",
      details: otpSent.message,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "serverError",
      details: "Server Error: " + error,
    });
  }
};

export const verifyOtpSignupController = async (req, res) => {
  const { firstName, lastName, email, password, otp } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !otp) {
      return res.status(200).json({
        status: false,
        message: "fieldsReq",
        details: "Please provide the required fields",
      });
    }

    const userAlreadyExists = await authModel.findOne({ email: email });
    if (userAlreadyExists) {
      return res.status(200).json({
        status: false,
        message: "duplicattion",
        details: "This email already registered",
      });
    }

    const foundedOtpRecord = await otpModel.findOne({ email: email });

    if (!foundedOtpRecord) {
      return res.status(200).json({
        status: false,
        message: "otpError",
        details: "Something went wrong, Please try resend OTP",
      });
    }

    if (foundedOtpRecord.otp != otp) {
      return res.status(200).json({
        status: false,
        message: "invalidOtp",
        details: "Invalid Otp",
      });
    }

    await otpModel.deleteOne({ email: email });

    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: await hash(password, 12),
    };

    const userData = await authModel.create(payload);

    const userToken = sign(
      {
        userId: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        joining: userData.joining,
      },
      jwtSecret
    );

    return res.status(200).json({
      status: true,
      message: "success",
      details: "Account created successfully",
      token: userToken,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "serverError",
      details: "Server Error: " + error,
    });
  }
};

export const verifyAccountLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(200).json({
        status: false,
        message: "fieldsReq",
        details: "Please provide all fields",
      });
    }

    const userAlreadyExists = await authModel.findOne({ email: email });
    if (!userAlreadyExists) {
      return res.status(200).json({
        status: false,
        message: "notFound",
        details: "Account don't exists, Please create account",
      });
    }

    const userData = userAlreadyExists;

    const passCorrect = await compare(password, userData.password);
    if (!passCorrect) {
      return res.status(200).json({
        status: false,
        message: "wrongPass",
        details: "Wrong Password",
      });
    }

    const otpSent = await sendOtp(userData.email);

    if (!otpSent.status) {
      res.status(200).json({
        status: false,
        message: "otpError",
        details: otpSent.message,
      });
    }

    const payload = {
      email: email,
      otp: otpSent.otp,
    };

    await otpModel.create(payload);

    return res.status(200).json({
      status: true,
      message: "success",
      details: otpSent.message,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "serverError",
      details: "Server Error: " + error,
    });
  }
};

export const verifyOtploginController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(200).json({
        status: false,
        message: "fieldsReq",
        details: "Please provide the required fields",
      });
    }

    const userAlreadyExists = await authModel.findOne({ email: email });
    if (!userAlreadyExists) {
      return res.status(200).json({
        status: false,
        message: "notFound",
        details: "Account don't exists, Please create an account",
      });
    }

    const userData = userAlreadyExists;

    const foundedOtpRecord = await otpModel.findOne({ email: email });

    if (!foundedOtpRecord) {
      return res.status(200).json({
        status: false,
        message: "otpError",
        details: "Something went wrong, Please try resend OTP",
      });
    }

    if (foundedOtpRecord.otp != otp) {
      return res.status(200).json({
        status: false,
        message: "invalidOtp",
        details: "Invalid Otp",
      });
    }

    await otpModel.deleteOne({ email: email });

    const userToken = sign(
      {
        userId: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        joining: userData.joining,
      },
      jwtSecret
    );

    return res.status(200).json({
      status: true,
      message: "success",
      details: "Login Successsfully",
      token: userToken,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "serverError",
      details: "Server Error: " + error,
    });
  }
};
