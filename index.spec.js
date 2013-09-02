var index = require('./index');
var expect = require('chai').expect;

describe('main', function (){
	
	it('should not explode when passed null', function(){
		expect(index.isAbsolute(null)).to.be.null;
	});
	it('should return true for url starting with http://', function(){
		expect(index.isAbsolute('http://www.google.com')).to.be.true;
	});
	it('should return true for url starting with https://', function(){
		expect(index.isAbsolute('https://www.google.com')).to.be.true;
	});
	it('should return true for protocol domainname and querystring', function(){
		expect(index.isAbsolute('https://github.com:80')).to.be.true;
	});
	it('should return true for protocol domainname and port', function(){
		expect(index.isAbsolute('https://github.com:80')).to.be.true;
	});
	it('should return true for protocol plus two level domain name', function(){
		expect(index.isAbsolute('https://github.com')).to.be.true;
	});
	it('should return true for url starting with a two part domain name', function(){
		expect(index.isAbsolute('google.com')).to.be.true;
	});
	it('should return true for ipv4 address', function(){
		expect(index.isAbsolute('192.168.21.21')).to.be.true;
	});
	it('should return true for protocol plus ipv4 address', function(){
		expect(index.isAbsolute('ftp://192.168.21.21')).to.be.true;
	});
	it('should return true for valid protocol relative url', function(){
		expect(index.isAbsolute('//google.com')).to.be.true;
	});
	it('should return false for invalid protocol relative url', function(){
		expect(index.isAbsolute('//googlecom')).to.be.false;
	});
	it('should return false for one word ', function(){
		expect(index.isAbsolute('google')).to.be.false;
	});
	it('should return false for protocol and one word ', function(){
		expect(index.isAbsolute('http://google')).to.be.false;
	});
	it('should return false for domain name with bad tld ', function(){
		expect(index.isAbsolute('google.bad')).to.be.false;
	});
	it('should return false for one word domain and everything else ', function(){
		expect(index.isAbsolute('http://google:8080/test/dir?what=where')).to.be.false;
	});
	it('should return false for protocol and domain name with bad tld ', function(){
		expect(index.isAbsolute('http://google.bad')).to.be.false;
	});
	it('should return true for psuedo javascript protocol', function(){
		expect(index.isAbsolute('javascript:void(0)')).to.be.true;
	});
	it('should return true for psuedo data protocol', function(){
		expect(index.isAbsolute('data:img/png,dsafsdfa')).to.be.true;
	});
	it('should return true for protocol relative url', function(){
		expect(index.isAbsolute('//www.dotcom.com')).to.be.true;
	});
	it('should return false for protocol relative url with a bad domain name', function(){
		expect(index.isAbsolute('//www.dotcom.txt')).to.be.false;
	});
	describe('#ensureComplete', function (){
		describe('when there is no context', function (){
			it('should not change a complete url', function(){
				expect(index.ensureComplete('https://www.google.com/?search=chevett')).to.be.equal('https://www.google.com/?search=chevett');
			});
			it('should add http if there is no protocol', function(){
				expect(index.ensureComplete('www.google.com/')).to.be.equal('http://www.google.com/');
			});
			it('should add http to a protocol relative url', function(){
				expect(index.ensureComplete('//www.google.com/')).to.be.equal('http://www.google.com/');
			});
			it('should not add a trailing slash to tld', function(){
				expect(index.ensureComplete('www.google.com')).to.be.equal('http://www.google.com');
			});
			it('should not add a trailing slash to tld and protocol', function(){
				expect(index.ensureComplete('https://www.google.com')).to.be.equal('https://www.google.com');
			});
			it('should preserve non standard port', function(){
				expect(index.ensureComplete('https://www.google.com:88/')).to.be.equal('https://www.google.com:88/');
			});
			it('should remove standard port', function(){
				expect(index.ensureComplete('http://www.google.com:80/')).to.be.equal('http://www.google.com/');
			});
			it('should remove standard ssl port', function(){
				expect(index.ensureComplete('https://www.google.com:443/')).to.be.equal('https://www.google.com/');
			});
			it('should remove standard ssl port when not ssl', function(){
				expect(index.ensureComplete('http://www.google.com:443/')).to.be.equal('http://www.google.com:443/');
			});
			it('should not change a psuedo javascript protocol url', function(){
				expect(index.ensureComplete('javascript:void(0)')).to.be.equal('javascript:void(0)');
			});
			it('should not change a psuedo data protocol url', function(){
				expect(index.ensureComplete('data:img/png,dsafsdfa')).to.be.equal('data:img/png,dsafsdfa');
			});
		});
		describe('when there is context', function (){
			it('should not change a complete url', function(){
				expect(index.ensureComplete('https://www.google.com/?search=chevett', 'http://www.yahoo.com')).to.be.equal('https://www.google.com/?search=chevett');
			});
			it('should resolve a relative url', function(){
				expect(index.ensureComplete('news/mike', 'http://www.yahoo.com')).to.be.equal('http://www.yahoo.com/news/mike');
			});
			it('should resolve a relative url and assume http', function(){
				expect(index.ensureComplete('news/mike', 'www.yahoo.com')).to.be.equal('http://www.yahoo.com/news/mike');
			});
			it('should resolve a relative url and preserve https', function(){
				expect(index.ensureComplete('news/mike', 'https://www.yahoo.com')).to.be.equal('https://www.yahoo.com/news/mike');
			});
			it('should resolve a relative url that kind of looks like a domain name', function(){
				expect(index.ensureComplete('google.txt', 'http://www.yahoo.com')).to.be.equal('http://www.yahoo.com/google.txt');
			});
			it('should not resolve a tld', function(){
				expect(index.ensureComplete('google.com', 'http://www.yahoo.com')).to.be.equal('http://google.com');
			});
			it('should resolve a relative url and preserve path if there is a trailing slash', function(){
				expect(index.ensureComplete('google', 'http://www.yahoo.com/news/')).to.be.equal('http://www.yahoo.com/news/google');
			});
			it('should resolve a relative url and not preserve path if there is no trailing slash', function(){
				expect(index.ensureComplete('google', 'http://www.yahoo.com/news')).to.be.equal('http://www.yahoo.com/google');
			});
			it('should resolve a relative file', function(){
				expect(index.ensureComplete('default.aspx', 'http://www.yahoo.com/news/')).to.be.equal('http://www.yahoo.com/news/default.aspx');
			});
			it('should use default protocol when there is no protocol', function(){
				expect(index.ensureComplete('default.aspx', 'www.yahoo.com/news/', {protocol: 'xxx:'})).to.be.equal('xxx://www.yahoo.com/news/default.aspx');
			});
			it('should not use default protocol when there is a protocol', function(){
				expect(index.ensureComplete('default.aspx', 'yyy://www.yahoo.com/news/', {protocol: 'xxx:'})).to.be.equal('yyy://www.yahoo.com/news/default.aspx');
			});
		});
	});
});
