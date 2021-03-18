const User = require('../models/user-schema');
const Contact = require('../models/contact-schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.getUser = (req, res, next) => {
    const email = req.query.email;
    const password = req.query.password;
    let user;
    User.findOne({email: email})
    .then(userDoc => {
        if(!userDoc){
           const error = new Error('No email exists')
           error.statusCode = 400
           throw error;
        }
        user = userDoc
        return bcrypt.compare(password, userDoc.password)
    })
    .then((flag) => {
        if(!flag){
            return res.status(400).json({
                message: 'Wrong password'
            })
        }
        const token = jwt.sign({
            _id: user._id.toString(),
            name:user.name,
            email: user.email
        }, process.env.KEY)
        return res.status(200).json({
            _id:user._id,
            token: token
        })
    })
    .catch(error => {
        next(error)
    })
};

exports.postUser = (req, res, next) => {
    const name = req.query.name;
    const email = req.query.email;
    const password = req.query.password;
    bcrypt.hash(password, 11)
    .then(hashedPassword => {
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        return user.save();
    })
    .then(userDoc => {
        const contact = new Contact({
            userId: userDoc._id
        })
        return contact.save();
    })
    .then(result => {
        res.status(201).json({
            message:'User successfully created'
        })
    })
    .catch(error => {
        next(error)
    })

}

exports.validEmail = (req, res, next) => {
    const email = req.query.email;
    User.findOne({email: email})
    .then(userDoc => {
        if(userDoc){
            return res.status(409).json({
                message: 'Email already exists'  
            });
        }
        next();
    })
    .catch(error => {
        next(error)
    })
}

exports.aboutUser = (req, res, next) => {
    const id = req.query.id;
    
    User.findById(id)
    .then(userDoc => {
        res.status(200).json({
            name: userDoc.name,
            email: userDoc.email,
            covidStatus: userDoc.covidStatus,
            riskStatus:userDoc.riskStatus    
        })
    })
    .catch(error => {
        next(error)
    })
}
