// init code
const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const salt = 'vishal';

// middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// routes goes here


// default route
router.all('/', function (req, res) {
    return res.json({
        status: true,
        message: 'User controller works...'
    })
});

// Create new user route
router.post('/createNew', [
    // Check for non-empty fields
    check('username').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
], function (req, res) {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'Form validation failed...',
            errors: errors.array()
        });
    }

    // hash password code
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    }, function (error, result) {
        // Check if any errors
        if (error) {
            return res.status(500).json({
                status: false,
                message: 'DB Insert failed...',
                error: error
            })
        }

        // If everything ok
        return res.status(200).json({
            status: true,
            message: 'DB Insert success...',
            result: result
        })
    })
})

// module exports
module.exports = router;
