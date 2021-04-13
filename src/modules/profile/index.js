import express from 'express';

import ProfileController from './profileController';

const Router = express.Router();

Router.get(
    '/profile',
    ProfileController.fetchProfile
);

Router.put(
    '/profile',
    ProfileController.editProfile
);


export default Router;