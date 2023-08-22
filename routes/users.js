const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');

const {registerUser, login , current, getUser , verifyOtp , reSendOtp , forgatePassword} = require('../Controller/usersController');


router.post('/register',registerUser);

router.post('/verify-otp' , verifyOtp)

router.post('/resend-otp' , reSendOtp);

router.post('/login',login);

router.get('/current' ,validateToken,current);

router.get('/get-all-user' , getUser);  

router.post('/forgate-password' , forgatePassword);

module.exports = router;
