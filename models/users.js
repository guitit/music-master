
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_name: { type: String, require: true, unique: true },
    email: { type: String, require: true},
    password: { type: String, require: true}
});

module.exports = mongoose.model('User' , userSchema);
