const logger = require('../utils/logs');
const User = require("../models/users");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
let message = '';
const url = require('url');


const checkEmail = function (req, res, next) {
    const queryObject = url.parse(req.url,true).query;
    if (req.body.email) {
        if (validateEmail(req.body.email)) {
            logger.info('The email is valid');
        }
        else {
            logger.error("The email is invalid");
            return res.status(401).json({ message: "The email is invalid - Please type a valid email" });
        }
    }
    next()
};
const signup = async function (req, res) {
    try{
        if (!req.body.user_name || !req.body.password || !req.body.email) {
            message = "Error - Missing Params -(user_name, password, email) are required params and can not be empty";
            logger.error(message);
            return res.status(401).json({ message });
        }
        let newUser = new User({ _id: mongoose.Types.ObjectId(),  user_name: req.body.user_name, password: bcrypt.hashSync(req.body.password, 10), email: req.body.email });
        const user = await User.findOne({ user_name: newUser.user_name });
        if (!user) {
            await newUser.save();
            return res.status(200).json({ newUser });
        }
    }
    catch(error) {
        message = `Error - can not create this user -`;
        logger.error(`${message} ${error}`);
        return res.status(401).json({ message });
    }
};
const login = async function (req, res) {
    try{
        const newUser = { user_name : req.body.user_name, password : req.body.password };
        const profile = await User.findOne({ user_name: newUser.user_name });
        if (!profile) {
            message = "Error - User not exists";
            logger.error(message);
            return res.status(401).json({ message });
        }
        else {
            if (bcrypt.compareSync(newUser.password,profile.password)) {  
                res.status(200).json({ profile });      
            }
            else { 
                message = "Error - User Unauthorized Access";
                logger.error(message);
                return res.status(401).json({ message });    
            }
        }
    }
    catch(error){
        message = `Error - can not Loged in`;
        logger.error(`${message} ${error}`);
        return res.status(401).json({ message });
    }
};

module.exports = {checkEmail, signup, login};



