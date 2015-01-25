absolurl [![Build Status](https://travis-ci.org/chevett/absolurl.png)](https://travis-ci.org/chevett/absolurl) [![Dependency Status](https://gemnasium.com/chevett/absolurl.png)](https://gemnasium.com/chevett/absolurl)
========
[![NPM](https://nodei.co/npm-dl/absolurl.png?months=1)](https://nodei.co/npm/absolurl/)

This is a silly library that attempts to guess if things are a tld domain or not.  It will never be 100% accurate and what you probably want is the built-in `url.resolve` method.



##examples
```js
var Absolurl = require('absolurl');
var a = new Absolurl();

a.resolve('news', 'http://google.com'); // 'http://google.com/news'
a.resolve('news', 'http://google.com/news/'); // 'http://google.com/news/news'
a.resolve('news', 'google.com/news/'); // 'http://google.com/news/news'
a.resolve('default.aspx', 'google.com/news/'); // 'http://google.com/news/default.aspx'
a.resolve('yahoo.com', 'google.com/news/'); // 'http://yahoo.com'
a.resolve('/wtf', 'google.com/news/'); // 'http://google.com/wtf'
a.resolve('192.168.1.1', 'google.com/news/'); // 'http://192.168.1.1'
a.resolve('file.txt', 'google.com'); // 'http://google.com/file.txt'
a.resolve('sky.net', 'http://google.com'); // 'http://sky.net/'
```
