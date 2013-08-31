var url = require('url');
var tlds = require('./tlds');

function _getOptions(options){
	
	var defaults = {
		protocol: 'http:',
		port: 80
	};

	if (!options){
		return Object.create(defaults);
	}

	Object.getOwnPropertyNames(defaults).forEach(function(propertyName){
		if (!options.hasOwnProperty(propertyName)){
			options[propertyName] = defaults[propertyName];
		}
	});

	return options;
}

function _parse(completeUrl){
	// handle user@pass one day
	var regex = /^(\w*:)\/\/([^\.]*(\.[^:\?\/]*))+(:(\d+))?([^\?]*)(\??(.*))$/;
	console.log(completeUrl);
	var match = completeUrl.match(regex);
//	console.log(match);
	var o = {
		protocol: match[1],
		slashes: true,
		host: match[2] + (match[4] || ''),
		hostname: match[2],
		port: match[5],
		seach: match[7],
		query: match[8],
		path: match[6] + (match[7] || ''),
		pathname: match[6]
	};

	if (!o.port) delete o.port;
	console.log(o);
	return o;
}

function _ensureComplete(strUrl, strContextUrl, options){
	if (!strUrl) return strUrl;

	options = _getOptions(options);

	if (_isRelative(strUrl)){
		if (!strContextUrl || _isRelative(strContextUrl)) return null;

		strContextUrl = _ensureProtocol(strContextUrl, options);
		strUrl = url.resolve(strContextUrl, strUrl);
	}
	
	strUrl = _ensureProtocol(strUrl, options);
//console.log(strUrl);
	var path = /\.\w*[^?](.*)/
	var oUrl = _parse(strUrl);
	oUrl.slashes = true;
	oUrl.protocol = oUrl.protocol || options.protocol; 

	delete oUrl.host;
	if (oUrl.protocol == 'http:' && oUrl.port == 80){
		delete oUrl.port;
	} else if (oUrl.protocol == 'https:' && oUrl.port == 443){
		delete oUrl.port;
	}

	if (oUrl.path==='/' && !/\/$/.test(strUrl)){
		delete oUrl.path;
		delete oUrl.pathname;
	}


	return url.format(oUrl);
}

function _ensureProtocol(strUrl, options){
	if (!/^\w{3,6}:\/\//.test(strUrl)){
		return options.protocol +'//' + strUrl;
	}

	return strUrl;
}
function _isAbsolute(strUrl){
	if (!strUrl) return strUrl;

	var match = strUrl.match(/^((\w{3,6}:)?\/\/)?([^:\/?$]*)/);
	if (!match || !match[3]) return false;

	if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(match[3])) return true;

	var domain = match[3];
	var domainSplit = domain.split('.');
	var tld = domainSplit[domainSplit.length-1];

	return !!tlds[tld.toUpperCase()];
}

function _isRelative(url){ return !_isAbsolute(url);}

function _hasProtocol(strUrl){
	var oUrl = url.parse(strUrl);
	return !!oUrl.port;
}

exports.isAbsolute =_isAbsolute;
exports.isRelative =_isRelative;
exports.hasProtocol =_hasProtocol;
exports.ensureComplete =_ensureComplete;
