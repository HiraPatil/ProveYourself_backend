const asyncHandler = require('express-async-handler')
const axios = require('axios');


const verifyCaptcha = asyncHandler(async (req , res)=>{
    const { recaptchaToken, otherData , secretKey} = req.body;

    try {
        const response = await axios.post(
          "https://www.google.com/recaptcha/api/siteverify",
          {
            secret: secretKey,
            response: recaptchaToken,
          }
        );
    
        if (response.data.success) {
          // reCAPTCHA verification successful, proceed with otherData processing
          // ...
          res.status(200).json({ success: true });
        } else {
          // reCAPTCHA verification failed
          res.status(400).json({ error: "reCAPTCHA verification failed." });
        }
      } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        res.status(500).json({ error: "Internal server error." });
      }
});

module.exports = {verifyCaptcha}