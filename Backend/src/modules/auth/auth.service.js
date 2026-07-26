const User = require('../users/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async(userData)=>{


    const existingUser =
        await User.findOne({
            email:userData.email
        });



    if(existingUser){

        const error=new Error(
            "Email already exists"
        );

        error.statusCode=400;

        throw error;

    }



    const {
        confirmPassword,
        ...data
    } = userData;



    const hashedPassword =
        await bcrypt.hash(
            data.password,
            10
        );



    const user =
        await User.create({

            ...data,

            password:hashedPassword

        });



    const safeUser =
        user.toObject();


    delete safeUser.password;


    return safeUser;

};





const login = async(userData)=>{


    const user =
        await User.findOne({
            email:userData.email
        });



    if(!user){

        const error=new Error(
            "User not found"
        );

        error.statusCode=400;

        throw error;

    }



    const valid =
        await bcrypt.compare(
            userData.password,
            user.password
        );



    if(!valid){

        const error=new Error(
            "Invalid password"
        );

        error.statusCode=400;

        throw error;

    }




    const token =
        jwt.sign(

            {
                id:user._id,
                role:user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn:
                process.env.JWT_EXPIRES_IN
            }

        );




    const safeUser =
        user.toObject();


    delete safeUser.password;



    return {

        accessToken:token,

        user:safeUser

    };


};



module.exports={
    register,
    login
};