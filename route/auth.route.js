const express = require('express')
const router = express.Router()
const { register, login } = require('../controller/auth.controller');
router.use(express.json());

router.post('/register', register);
router.post('/login', login);
router.get('/ping',(req, res, next) => {
    console.log(req)
    res.json({
        "data": null,
        "message": "PONG",
        "status": 200
    })
})
module.exports = router;