import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import errorHandler from './../../helpers/errorHandler';
import models from './../../database/models';

class ProfileController {
    static async fetchProfile(req, res) {
        let token = req.headers['authorization'];

        if (token) {
            token = token.slice(7, token.length);
            const email = await jwt.verify(token, 'secret').email;

            const user = await models.User.findOne({
                where: {email: email},
            });

        return res.status(200).json({
            success: true,
            user: user
        });

        }else {
            return res.status(400).json({
                success: false,
                message: 'Make sure to login to make this request.'
            })
        }

    }

    static async editProfile(req, res) {
        try {

            const saltRounds = 10;

            if (req.body.password) {
                //check if user already exists
                const userExists = await models.User.findOne({
                    where: {email: req.body.email},
                });

                if (bcrypt.compareSync(req.body.currentPassword, userExists.dataValues.password)) {
                    req.body.password = await bcrypt.hash(req.body.password, saltRounds).then((hash) => hash);

                } else {

                    return res.status(403).json({
                        success: false,
                        message: 'Current password is incorrect.Type in the current password.'
                    });

                }
            }


            delete req.body.profile;
            const edittedUser = await models.User.update(
                req.body,
                {where: {email: req.body.email}}
            );

            if (edittedUser[0] === 1){
                return res.status(200).json({
                    success: true,
                    message: 'User profile editted successfully',
                });

            } else {
                return res.status(500).json({
                    success: false,
                    message: 'User profile not successful.Try again.',
                })
            }


        } catch (error) {
            errorHandler.handleError(error, 500, res);
        }
    }

}

export default ProfileController;