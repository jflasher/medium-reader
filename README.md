# medium-reader

A package to deliver Medium RSS feed results in a nice manner.

Install dependencies

```
npm install
```

Can be used in the following manner

```
var getPosts = require('medium-reader');

getPosts('@asd', function (err, posts) {
    if (err) { return console.log(err); }

    for (var i = 0; i < posts.length; i++) {
        doSomething(posts[i]);
    }
});
```