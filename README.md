absolurl [![Build Status](https://travis-ci.org/chevett/absolurl.png)](https://travis-ci.org/chevett/absolurl)
========


examples
=======
absolurl.isAbsolute('www.google.com') => true

absolurl.isAbsolute('google.com') => true

absolurl.isAbsolute('google.txt') => false

absolurl.isAbsolute('cheve.tt') => true

absolurl.isAbsolute('192.168.1.1') => true

absolurl.isAbsolute('https://github.com') => true

absolurl.isRelative('/wtf') => true

assolurl.isRelative('default.aspx') => true

assolurl.isRelative('default.aspx?wtf=really') => true

