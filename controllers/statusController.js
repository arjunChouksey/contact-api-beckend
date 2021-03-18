const User = require('../models/user-schema');
const Contact = require('../models/contact-schema');

exports.reportPostive = (req, res, next) => {
    const id = req.query.id;
    const time = Date.now() - 50400000; //converted 14 hrs in ms
    User.findById(id)
    .then(userDoc => {
        userDoc.covidStatus = true;
        userDoc.riskStatus = true;
        return userDoc.save();
    })
    .then(userDocSaved => {
        return Contact.findOne({userId: id})
        .select('contactArr.msTime contactArr.userId -_id')
    })
    .then(contactDoc => {
        const ids = [];
        contactDoc.contactArr.forEach(element => {
            if (element.msTime >= time){
                ids.push(element.userId);
            }
        });
        return ids;
    })
    .then(ids => {
        return User.find({_id :{$in: ids}})
    })
    .then(users => {
        users.forEach(user => {
            user.riskStatus = true;
            user.save();
        })
        return res.status(200).json({
            message:'reported positive successfully'
        })
    })
    .catch(error => {
        next(error)
    })
}

exports.reportNegative = (req, res, next) => {
    const id = req.query.id;
    const time = Date.now() - 50400000; //converted 14 hrs in ms
    let user;
    User.findById(id)
    .then(userDoc => {
        user = userDoc;
        user.covidStatus = false;
        return Contact.findOne({userId:id})
        .select('contacArr.userId contactArr.msTime -_id')
        .populate('contactArr.userId','covidStatus -_id')
    })
    .then(contactDoc => {
        contactDoc.contactArr.forEach(ele => {
            if(ele.msTime >= time){
                user.riskStatus = user.riskStatus || ele.userId.covidStatus
                
            }
        })
        return user.save();
    })
    .then(userDoc => {
        res.status(200).json({
            message: 'reported negative successfully'
        })
    })
    .catch(error => {
        next(error)
    })
}