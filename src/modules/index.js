import auth from './auth';
import profile from './profile';
import jobPosts from './jobPosts';

const apiPrefix = '/api/v1';

const routes = (app) => {
    app.use(apiPrefix, auth);
    app.use(apiPrefix, profile);
    app.use(apiPrefix, jobPosts);
    return app;
}

export default routes;