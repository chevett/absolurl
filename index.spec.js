var index = require('./index');
var expect = require('chai').expect;

describe('main', function (){
	
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


	describe('#ensureComplete', function (){
		describe('when there is no context', function (){
			it('should not change a complete url', function(){
				expect(index.ensureComplete('https://www.google.com/?search=chevett')).to.be.equal('https://www.google.com/?search=chevett');
			});
			it('should add http if there is no protocol', function(){
				expect(index.ensureComplete('www.google.com/')).to.be.equal('http://www.google.com/');
			});
			it('should add a trailing slash to tld', function(){
				expect(index.ensureComplete('https://www.google.com')).to.be.equal('https://www.google.com/');
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
		});
	});
});
