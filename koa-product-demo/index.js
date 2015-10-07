
/**
 * Module dependencies.
 */
var http = require('http');
var logger = require('koa-logger');
var route = require('koa-route');
var serve = require('koa-static');
var koa = require('koa');
var app = module.exports = koa();

// middleware

app.use(logger());
app.use(serve(__dirname + '/static'));

// route middleware
var posts = require('./routers/posts');
app.use(route.get('/', posts.list));
app.use(route.get('/post/new', posts.add));
app.use(route.get('/post/:id', posts.show));
app.use(route.post('/post', posts.create));
app.use(route.post('/post/:id', posts.update));
app.use(route.get('/post/:id/edit', posts.edit));
app.use(route.get('/post/:id/delete', posts.remove));

// listen
// app.listen(3000);//等价于以下一行
http.createServer(app.callback()).listen(3000, function () {
	console.log('listening on port 3000');
});