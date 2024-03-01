import nodemailer from "nodemailer";
import otpModel from "../Models/otpModel.js";
import { config } from "dotenv";
config();

const senderEmail = process.env.EMAIL;
const senderEmailPass = process.env.PASS;

export const sendOtp = async (email) => {
  try {
    // Checking if the email already sent
    await otpModel.findOneAndDelete({ email: email });

    const otp = Math.floor(1000 + Math.random() * 9000);

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: senderEmailPass,
      },
    });

    const mailOptions = {
      from: { name: "Company", address: senderEmail },
      to: email,
      subject: "Account Verification OTP",
      html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                        }
            
                        .container {
                            background-color: #ff0080;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            width: 90%;
                            text-align: center;
                        }
            
                        h1 {
                            color: #fff;
                        }
            
                        p {
                            color: #fff;
                        }
            
                        .verification-code {
                            font-size: 24px;
                            font-weight: bold;
                            color: #fff;
                            user-select: all; 
                            cursor: pointer; 
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Email Verification</h1>
                        <p>Your One-Time Verification Code is:</p>
                        <p class="verification-code" id="otpCode">${otp}</p>
                    </div>
                </body>
                </html>
              `,
    };

    transporter.sendMail(mailOptions);

    const response = {
      status: true,
      message: "An OTP sent to your email",
      otp: otp,
    };
    return response;
  } catch (error) {
    const response = {
      status: false,
      message: "Error sending OTP, Please try again",
    };
    console.log(error);
    return response;
  }
};
