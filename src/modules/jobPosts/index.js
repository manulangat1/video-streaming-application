import express from 'express';

import JobPostsController from './jobPostsController';

const Router = express.Router();

Router.get(
    '/job-posts',
    JobPostsController.fetchJobPosts
);


export default Router;