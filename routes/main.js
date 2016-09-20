
var Express = require('express'),
    Router = Express.Router();

// Get homepage
Router.get('/', function (req, res) {
    res.render('index');
});

Router.get('/login', function (req, res) {
    res.render('login');
});

Router.get('/register', function (req, res) {
    res.render('register');
});

Router.get('/gallery', function (req, res) {
    res.render('gallery');
});

Router.get('/contact', function (req, res) {
    res.render('contact');
});

Router.get('/blog-archive', function (req, res) {
    res.render('blog-archive');
});

Router.get('/blog-single', function (req, res) {
    res.render('blog-single');
});

Router.get('/course', function (req, res) {
    res.render('course');
});

Router.get('/course-detail', function (req, res) {
    res.render('course-detail');
});

module.exports = Router;

