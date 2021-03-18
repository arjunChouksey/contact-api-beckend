const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    contactArr: [
        {
            contactTime: {
                type: Schema.Types.String,
                default: Date()
            },
            msTime: {
                type: Schema.Types.Number,
                default: Date.now()
            },
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model('Contact', ContactSchema);