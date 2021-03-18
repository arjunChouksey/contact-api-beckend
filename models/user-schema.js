const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type:  Schema.Types.String,
        required: true
    },
    password: {
        type:  Schema.Types.String
    },
    covidStatus: {
        type: Schema.Types.Boolean,
        default:false
    },
    riskStatus: {
        type: Schema.Types.Boolean,
        default:false
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);