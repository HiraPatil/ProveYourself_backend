const asyncHandler = require('express-async-handler');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Otp = require('../models/otpModel');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


var userName = '';

const emailTemplate = `
<!DOCTYPE html>
<html>

<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f2f2f2; padding: 10px; text-align: center;">
      <h1>Welcome to Prove YourSelf</h1>
    </div>
    <div style="padding: 20px; background-color: #ffffff;">
      <p>Hello ,${userName}</p>
      <p>Thank you for signing up to our service. Your account has been successfully created.</p>
      <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
    </div>
    <div style="background-color: #f2f2f2; padding: 10px; text-align: center;">
      <p>Best regards,<br>Prove YourSelf</p>
    </div>
  </div>
</body>
</html>`

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, mobile_no, refer_by } = req.body;
    if (!username || !email || !password || !mobile_no) {
        res.status(400);
        throw new Error("All Field are required");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User allready available");
    }
    const hashPass = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        mobile_no,
        refer_by,
        password: hashPass,
    })

    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    const OptSet = await Otp.create({
        email,
        otp,
    });

    if (user) {
        const info = await transporter.sendMail({
            from: 'hiralalpatil2001@gmail.com', // sender address
            to: `${user.email}`, // list of receivers
            subject: "Registration Success ", // Subject line
            text: "Hello world?", // plain text body
            html: `<!DOCTYPE html>
            <html>
            
            <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f2f2f2; padding: 10px; text-align: center;">
                  <h1>Welcome to Prove YourSelf</h1>
                </div>
                <div style="padding: 20px; background-color: #ffffff;">
                  <p>Hello ,${user.username}</p>
                  <p>Thank you for signing up to our service.</p>
                  <p> Your Opt is : <b>${otp}</b></p>
                  <p>It valid upto 30 min</p>
                </div>
                <div style="background-color: #f2f2f2; padding: 10px; text-align: center;">
                  <p>Best regards,<br>Prove YourSelf</p>
                </div>
              </div>
            </body>
            </html>`,
        });
        res.status(200).json({ _id: user.id, email: user.email, info })
    } else {
        res.status(400);
        throw new Error("User data us not valid");
    }
});



const reSendOtp = asyncHandler(async (req, res) => {
 
        const { email, forgatePassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error("User not exists with this Email");
        }

        let title = `<h1>Welcome to Prove YourSelf</h1>`;
        let subject = "Registration Success";
        let emailPara = `<p>Thank you for signing up to our service.</p>`


        if (forgatePassword) {
            title = `<h1>Reset Your Password</h1>`;
            subject = `Forgate Password`;
            emailPara = `<p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>`
        }

        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        const updateOtp = await Otp.findOneAndUpdate(
            { email }, // Filter the document by email
            { otp }, // Update the otp field with the new OTP
            { new: true, upsert: true } // Return the updated document or create a new one if not found
        );

        const info = await transporter.sendMail({
            from: 'hiralalpatil2001@gmail.com',
            to: user.email,
            subject: subject,
            html: `<!DOCTYPE html>
                <html>
                
                <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #f2f2f2; padding: 10px; text-align: center;">
                      ${title}
                    </div>
                    <div style="padding: 20px; background-color: #ffffff;">
                      <p>Hello ,${user.username}</p>
                      ${emailPara}
                      <p> Your Opt is : <b>${otp}</b></p>
                      <p>It valid upto 30 min</p>
                    </div>
                    <div style="background-color: #f2f2f2; padding: 10px; text-align: center;">
                      <p>Best regards,<br>Prove YourSelf</p>
                    </div>
                  </div>
                </body>
                </html>`,
        });

        res.status(200).json({ message: "OTP sent successfully" });
});


const verifyOtp = asyncHandler(async (req, res) => {

        const { email, otp } = req.body;
        const otpCheck = await Otp.findOne({ email });

        if (!otpCheck) {
            res.status(404);
            throw new Error("Otp Expired!");
        }

        if (otpCheck.otp !== otp) {
            res.send(404);
            throw new Error('Incorrect OTP.');
        }

        const userContact = await User.findOneAndUpdate(
            { email },
            { isVerified: 1 },
            { new: true }
        );

        res.status(200).json({ message: "OTP verified successfully" });
});

const getUser = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(400);
        throw new Error("User Not Found")
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

const forgatePassword = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error("User not found!");
        }

        const otpCheck = await Otp.findOne({ email });

        if (!otpCheck) {
            res.status(404);
            throw new Error("Otp Expired!");
        }

        if (otpCheck.otp !== otp) {
            res.status(404);
            throw new Error('Incorrect OTP.');
        }

        const hashPass = await bcrypt.hash(password, 10);

        const userContact = await User.findOneAndUpdate(
            { email },
            { password: hashPass },
            { new: true }
        );
        res.status(200).json({"message" : "Your password change successfully!"});
    
});

const current = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser, login, current, getUser, verifyOtp, reSendOtp, forgatePassword };