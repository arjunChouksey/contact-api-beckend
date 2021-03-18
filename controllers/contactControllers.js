const User = require('../models/user-schema');
const Contact = require('../models/contact-schema');

exports.getNames = (req, res, next) => {
    const name = req.query.name;
    
    if(name===''){
        return res.status(200).json({
            names:[]
        })
    }
    else{
        User.find({name: { "$regex": name, "$options": "i" }}).select('name email covidStatus riskStatus _id')
        .then(userDocs => {
            res.status(200).json({
                names: userDocs
            })
        })
        .catch(error => {
            next(error)
        })
    }
}

exports.addContact = (req, res, next) => {
    const id1 = req.query.id1;
    const id2 = req.query.id2;
    let one;
    let two;
    User.findById(id1)
    .then(userDocOne => {
        one = userDocOne;
        return User.findById(id2)
    })
    .then(userDocTwo => {
        two = userDocTwo;
        one.riskStatus = one.riskStatus || two.covidStatus;
        two.riskStatus = two.riskStatus || one.covidStatus;
        return one.save();
    })
    .then(savedOne => {
        return two.save();
    })
    .then(savedTwo => {
        return Contact.findOne({userId: id1})
    })
    .then(contactResOne => {
        contactResOne.contactArr.unshift({
            userId: id2
        });
        return contactResOne.save();
    })
    .then(resultOne => {
        return Contact.findOne({userId: id2});
    })
    .then(contactResTwo => {
        contactResTwo.contactArr.unshift({
            userId: id1
        });
        return contactResTwo.save();
    })
    .then(resultTwo => {
        return res.status(200).json({
            message:'contact established'
        });
    })
    .catch(error => {
        next(error)
    })
}

exports.getContacts = (req, res, next) => {
    const id = req.query.id;

    Contact.findOne({userId:id})
    .select('contactArr.contactTime contactArr.userId contactArr._id -_id')
    .populate('contactArr.userId','covidStatus riskStatus name email -_id')
    .then(contactDoc => {
        res.status(200).json({
            contactArr: contactDoc.contactArr
        })
    })
    .catch(error => {
        next(error)
    })
}

