import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import SendGridHelper from './../../helpers/sendGridHandler';
import errorHandler from './../../helpers/errorHandler';
import models from './../../database/models';

class AuthController {
    static async createUser(req, res) {
        try {
            const saltRounds = 10;

            //check if user already exists
            const userExists = await models.User.findOne({
                where: {email: req.body.email},
            });
            if (userExists){
                return res.status(400).json({
                    success: false,
                    message: 'An account with the same email already exists.'
                })
            }
            const token = uuidv4();
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds).then((hash) => hash);

            const result = await models.User.create({firstName: req.body.name, lastName: req.body.lastname, email: req.body.email, password: hashedPassword, token});
            
            SendGridHelper.sendConfirmationMail(token, req.body.email);

            return res.status(201).json({
                success: true,
                message: 'User registered successfully.Confirmation email sent to your email address.Confirm and then log in.',
                user: result
            })
            
        } catch (error) {
            errorHandler.handleError(error, 500, res);
        }
    }

    static async loginUser(req, res) {
        try {
            const {email, password} = req.body;

            //check if user already exists
            const userExists = await models.User.findOne({
                where: {email: email},
            });

            if (userExists){
                if (userExists.dataValues.status){
                    if (bcrypt.compareSync(password, userExists.dataValues.password)) {

                        const token = jwt.sign({
                        email,
                        }, 'secret', { expiresIn: '2h' });

                        return res.status(200).json({
                        success: true,
                        message: 'Logged in successfully.',
                        token,
                        });
                    }
                    return res.status(403).json({
                        success: false,
                        message: 'Password not correct.',
                    });
                }else{
                    return res.status(403).json({
                        success: false,
                        message: 'Log in failed.Confirm email then log in.',
                    });
                }
                
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'No user exists with such email.',
                  });
            }


        } catch (error) {
            console.log('LOGIN ERROR', error);
            errorHandler.handleError(error, 500, res);
        }
    }

    static async confirmEmail (req, res) {
        try {
            const {token, email} = req.body;
            //check if user already exists
            const userExists = await models.User.findOne({
                where: {email: email},
            });

            if (userExists && userExists.token === token) {
                if (userExists.status){
                    return res.status(200).json({
                        success: true,
                        message: 'Email already confirmed.Please log in.'
                    });
                } else {
                    const confirmedUser = await models.User.update(
                        {status: 1},
                        {where: {email: email}}
                    );
                    if(confirmedUser[0] === 1) {
                        return res.status(200).json({
                            success: true,
                            message: 'Email successfully confirmed.'
                        });
                    }
                }

            } else {
                return res.status(403).json({
                    success: false,
                    message: 'No user exists with submitted email.Signup and confirm your email.',
                  });
            }

        } catch (error) {
            errorHandler.handleError(error, 500, res);
        }
    }

    static async forgotPassword (req, res) {
        try {
            const {email} = req.body;
            
            const userExists = await models.User.findOne({
                where: {email: email},
            });

            if (userExists) {
                SendGridHelper.sendForgotPasswordMail(email);
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'No user exists with such credentials.Signup and confirm your email.',
                  });
            }

        } catch (error) {
            errorHandler.handleError(error, 500, res);
        }
    }

    static async resetPassword (req, res) {
        try {
            const saltRounds = 10;
            const {email, password} = req.body;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds).then((hash) => hash);

            const userExists = await models.User.findOne({
                where: {email: email},
            });

            userExists.password = hashedPassword;
            const newPasswordUser = await userExists.save();

            if(newPasswordUser.dataValues.password === hashedPassword) {
                return res.status(200).json({
                    success: true,
                    message: 'Password successfully reset.'
                });
            }

            
        } catch (error) {
            errorHandler.handleError(error, 500, res);
        }
    }

}

export default AuthController;