const express = require('express')
const router = express.Router()
const userRoute = require('../route/user.route');
const authRoute = require('../route/auth.route');
const morgan = require('morgan')

router.use(morgan('dev'))
router.use('/api/v1/user', userRoute);
router.use('/api/v1/auth', authRoute);

module.exports = router