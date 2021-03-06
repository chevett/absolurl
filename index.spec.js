var Absolurl = require('./index');
var a = new Absolurl();
var expect = require('chai').expect;

describe('main', function (){

	it('should not explode when passed null', function(){
		expect(a.isAbsolute(null)).to.be.null;
	});
	it('should return true for url starting with http://', function(){
		expect(a.isAbsolute('http://www.google.com')).to.be.true;
	});
	it('should return true for url starting with https://', function(){
		expect(a.isAbsolute('https://www.google.com')).to.be.true;
	});
	it('should return true for protocol domainname and querystring', function(){
		expect(a.isAbsolute('https://github.com:80')).to.be.true;
	});
	it('should return true for protocol domainname and port', function(){
		expect(a.isAbsolute('https://github.com:80')).to.be.true;
	});
	it('should return true for protocol plus two level domain name', function(){
		expect(a.isAbsolute('https://github.com')).to.be.true;
	});
	it('should return true for url starting with a two part domain name', function(){
		expect(a.isAbsolute('google.com')).to.be.true;
	});
	it('should return true for ipv4 address', function(){
		expect(a.isAbsolute('192.168.21.21')).to.be.true;
	});
	it('should return true for protocol plus ipv4 address', function(){
		expect(a.isAbsolute('ftp://192.168.21.21')).to.be.true;
	});
	it('should return true for valid protocol relative url', function(){
		expect(a.isAbsolute('//google.com')).to.be.true;
	});
	it('should return false for invalid protocol relative url', function(){
		expect(a.isAbsolute('//googlecom')).to.be.false;
	});
	it('should return false for one word ', function(){
		expect(a.isAbsolute('google')).to.be.false;
	});
	it('should return false for protocol and one word ', function(){
		expect(a.isAbsolute('http://google')).to.be.false;
	});
	it('should return false for domain name with bad tld ', function(){
		expect(a.isAbsolute('google.bad')).to.be.false;
	});
	it('should return false for one word domain and everything else ', function(){
		expect(a.isAbsolute('http://google:8080/test/dir?what=where')).to.be.false;
	});
	it('should return false for protocol and domain name with bad tld ', function(){
		expect(a.isAbsolute('http://google.bad')).to.be.false;
	});
	it('should return true for psuedo javascript protocol', function(){
		expect(a.isAbsolute('javascript:void(0)')).to.be.true;
	});
	it('should return true for psuedo data protocol', function(){
		expect(a.isAbsolute('data:img/png,dsafsdfa')).to.be.true;
	});
	it('should return true for protocol relative url', function(){
		expect(a.isAbsolute('//www.dotcom.com')).to.be.true;
	});
	it('should return false for protocol relative url with a bad domain name', function(){
		expect(a.isAbsolute('//www.dotcom.txt')).to.be.false;
	});
	it('should true for localhost', function(){
		expect(a.isAbsolute('localhost:3000')).to.be.true;
	});






	describe('#resolve', function (){
		it('should throw real errors', function (done) {
			try {
				a.resolve(['this','will','throw'])
				done(new Error('didnt throw an error'));
			} catch (err) {
				expect(err).to.be.an.instanceof(Error);
				done();
			}
		})
		describe('when there is no context', function (){
			it('should not change a complete url', function(){
				expect(a.resolve('https://www.google.com/?search=chevett')).to.be.equal('https://www.google.com/?search=chevett');
			});
			it('should add http if there is no protocol', function(){
				expect(a.resolve('www.google.com/')).to.be.equal('http://www.google.com/');
			});
			it('should add http to a protocol relative url', function(){
				expect(a.resolve('//www.google.com/')).to.be.equal('http://www.google.com/');
			});
			it('should not add a trailing slash to tld', function(){
				expect(a.resolve('www.google.com')).to.be.equal('http://www.google.com');
			});
			it('should not add a trailing slash to tld and protocol', function(){
				expect(a.resolve('https://www.google.com')).to.be.equal('https://www.google.com');
			});
			it('should preserve non standard port', function(){
				expect(a.resolve('https://www.google.com:88/')).to.be.equal('https://www.google.com:88/');
			});
			it('should remove standard port', function(){
				expect(a.resolve('http://www.google.com:80/')).to.be.equal('http://www.google.com/');
			});
			it('should remove standard ssl port', function(){
				expect(a.resolve('https://www.google.com:443/')).to.be.equal('https://www.google.com/');
			});
			it('should remove standard ssl port when not ssl', function(){
				expect(a.resolve('http://www.google.com:443/')).to.be.equal('http://www.google.com:443/');
			});
			it('should not change a psuedo javascript protocol url', function(){
				expect(a.resolve('javascript:void(0)')).to.be.equal('javascript:void(0)');
			});
			it('should not change a psuedo data protocol url', function(){
				expect(a.resolve('data:img/png,dsafsdfa')).to.be.equal('data:img/png,dsafsdfa');
			});
			it('should treat localhost as a valid domain name', function(){
				expect(a.resolve('localhost:3000/what')).to.be.equal('http://localhost:3000/what');
			});
			it('should treat localhost as a legit domain', function(){
				expect(a.resolve('localhost:3001')).to.be.equal('http://localhost:3001');
			});
			it('should handle underscores', function(){
				expect(a.resolve('localhost:3001?_what=1')).to.be.equal('http://localhost:3001?_what=1');
			});
		});
		describe('when there is context', function (){
			it('should not change a complete url', function(){
				expect(a.resolve('https://www.google.com/?search=chevett', 'http://www.yahoo.com')).to.be.equal('https://www.google.com/?search=chevett');
			});
			it('should resolve a relative url', function(){
				expect(a.resolve('news/mike', 'http://www.yahoo.com')).to.be.equal('http://www.yahoo.com/news/mike');
			});
			it('should resolve \'com/\' as a relative url', function(){
				expect(a.resolve('com/', 'http://www.yahoo.com')).to.be.equal('http://www.yahoo.com/com/');
			});
			it('should resolve \'comm/\' as a relative url', function(){
				expect(a.resolve('comm/', 'http://www.yahoo.com')).to.be.equal('http://www.yahoo.com/comm/');
			});
			it('should resolve a relative url and assume http', function(){
				expect(a.resolve('news/mike', 'www.yahoo.com')).to.be.equal('http://www.yahoo.com/news/mike');
			});
			it('should resolve a relative url and preserve https', function(){
				expect(a.resolve('news/mike', 'https://www.yahoo.com')).to.be.equal('https://www.yahoo.com/news/mike');
			});
			it('should resolve a relative url that kind of looks like a domain name', function(){
				expect(a.resolve('google.txt', 'http://www.yahoo.com')).to.be.equal('http://www.yahoo.com/google.txt');
			});
			it('should not resolve a tld', function(){
				expect(a.resolve('google.com', 'http://www.yahoo.com')).to.be.equal('http://google.com');
			});
			it('should resolve a relative url and preserve path if there is a trailing slash', function(){
				expect(a.resolve('google', 'http://www.yahoo.com/news/')).to.be.equal('http://www.yahoo.com/news/google');
			});
			it('should resolve a relative url and not preserve path if there is no trailing slash', function(){
				expect(a.resolve('google', 'http://www.yahoo.com/news')).to.be.equal('http://www.yahoo.com/google');
			});
			it('should resolve a relative file', function(){
				expect(a.resolve('default.aspx', 'http://www.yahoo.com/news/')).to.be.equal('http://www.yahoo.com/news/default.aspx');
			});
			it('should use default protocol when there is no protocol', function(){
				expect(a.resolve('default.aspx', 'www.yahoo.com/news/', {protocol: 'xxx:'})).to.be.equal('xxx://www.yahoo.com/news/default.aspx');
			});
			it('should not use default protocol when there is a protocol', function(){
				expect(a.resolve('default.aspx', 'yyy://www.yahoo.com/news/', {protocol: 'xxx:'})).to.be.equal('yyy://www.yahoo.com/news/default.aspx');
			});
			it('should resolve github calendar data', function(){
				expect(a.resolve('users/chevett/contributions_calendar_data', 'https://github.com/chevett')).to.be.equal('https://github.com/users/chevett/contributions_calendar_data');
			});
			it('should not change mailto: urls', function(){
				expect(a.resolve('mailto:bgates@microsoft.com', 'https://github.com/chevett')).to.be.equal('mailto:bgates@microsoft.com');
			});
			it('should handle trailing garbage', function(){
				expect(a.resolve('http://www.google.com?q=1\n')).to.be.equal('http://www.google.com?q=1');
			});
		});
	});
});
