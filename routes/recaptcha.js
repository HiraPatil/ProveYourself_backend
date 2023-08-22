const express = require('express');
const router = express.Router();

const {verifyCaptcha} = require('../Controller/recaptchaController');

router.post('/verify-captcha' , verifyCaptcha);

module.exports = router;