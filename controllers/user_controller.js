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

// Create new user route using save
router.post('/save', [
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

    // Create a new user model
    var temp = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    // Insert data into DB
    temp.save(function (error, result) {
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

// Create new user route using create
router.post('/create', [
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

router.get('/find', function (req, res) {
    User.find(function (error, result) {
        // check error
        if (error) {
            return res.status(500).json({
                status: false,
                message: 'DB find failed...',
                error: error
            })
        }
        // If everything ok
        return res.status(200).json({
            status: true,
            message: 'DB find success...',
            result: result
        })
    })
})

router.get('/find/:email', function (req, res) {
    User.find({
        email: req.params.email
    },
        {
            password: 0
        },
        function (error, result) {
            // check error
            if (error) {
                return res.status(500).json({
                    status: false,
                    message: 'DB find failed...',
                    error: error
                })
            }
            // If everything ok
            return res.status(200).json({
                status: true,
                message: 'DB find success...',
                result: result
            })
        })
})

// Update user document
router.put('/update/:email', function (req, res) {
    // Check if email exits
    if (req.params.email) {
        User.updateOne({
            email: req.params.email
        },
            {
                username: req.body.username
            },
            function (error, result) {
                // Check error
                if (error) {
                    return res.status(500).json({
                        status: false,
                        message: 'DB update failed...',
                        error: error
                    })
                }

                // If everything ok
                return res.status(200).json({
                    status: true,
                    message: 'DB update sussess...',
                    result: result
                })
            })
    } else {
        return res.json({
            status: false,
            message: 'Email not provided...'
        })
    }
})

// Delete user document
router.delete('/delete/:email', function (req, res) {
    if (req.params.email) {
        User.deleteOne({
            email: req.params.email
        }, function (error, result) {
            // Check if any error
            if (error) {
                return res.status(500).json({
                    status: false,
                    message: 'DB delete failed...',
                    error: error
                });
            }

            // If everything ok
            return res.status(200).json({
                status: true,
                message: 'DB delete sucess...',
                result: result
            });
        })
    } else {
        return res.status(500).json({
            status: false,
            message: 'Email not privided...'
        });
    }
})

// user login
router.post('/login',
    [
        // Check for non-empty fields
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
        // check email exists or not
        User.findOne({
            email: req.body.email
        }, function (error, result) {
            // If error
            if (error) {
                return res.status(500).json({
                    status: false,
                    message: 'DB read failed...'
                })
            }
            else if (result) {
                // match password
                const isMatch = bcrypt.compareSync(req.body.password, result.password);

                // Check password is matched
                if (isMatch) {
                    return res.json({
                        status: true,
                        message: 'Login success..',
                        result: result
                    });
                } else {
                    return res.json({
                        status: false,
                        message: 'Login failed..'
                    });
                }
            } else {
                return res.status(500).json({
                    status: false,
                    message: 'User doesnot exist...'
                })
            }
        })
    })


// module exports
module.exports = router;
