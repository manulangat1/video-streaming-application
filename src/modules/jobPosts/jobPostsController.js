import errorHandler from '../../helpers/errorHandler';
import jobPosts from './../../helpers/dummyData/job-posts';

class JobPostsController {
    static async fetchJobPosts(req, res) {

        try {

            return res.status(200).json({
                success: true,
                message: 'Job posts fetched successfully.',
                jobPosts: jobPosts,
            });
            
        } catch (error) {
            errorHandler.handleError(error, 500, res);
        }
    }
}

export default JobPostsController;