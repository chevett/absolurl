absolurl [![Build Status](https://travis-ci.org/chevett/absolurl.png)](https://travis-ci.org/chevett/absolurl) [![Dependency Status](https://gemnasium.com/chevett/absolurl.png)](https://gemnasium.com/chevett/absolurl)
========
[![NPM](https://nodei.co/npm-dl/absolurl.png?months=1)](https://nodei.co/npm/absolurl/)

##examples
```js
absolurl.isAbsolute('www.google.com') => true
absolurl.isAbsolute('google.com') => true
absolurl.isAbsolute('google.txt') => false
absolurl.isAbsolute('cheve.tt') => true
absolurl.isAbsolute('192.168.1.1') => true
absolurl.isAbsolute('https://github.com') => true

absolurl.isRelative('/wtf') => true
assolurl.isRelative('default.aspx') => true
absolurl.isRelative('default.aspx?wtf=really') => true

absolurl.ensureComplete('news', 'http://google.com') => 'http://google.com/news'
absolurl.ensureComplete('news', 'http://google.com/news/') => 'http://google.com/news/news'
absolurl.ensureComplete('news', 'google.com/news/') => 'http://google.com/news/news'
absolurl.ensureComplete('file.txt', 'google.com') => 'http://google.com/file.txt'
absolurl.ensureComplete('sky.net', 'http://google.com') => 'http://sky.net/'
```
