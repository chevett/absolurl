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

function _ensureComplete(strUrl, strContextUrl, options){
	if (!strUrl) return strUrl;

	options = _getOptions(options);

	if (_isRelative(strUrl) && (!strContextUrl || _isRelative(strContextUrl))){
		return null;
	} else if (_isRelative(strUrl)){
		strContextUrl = _ensureProtocol(strContextUrl, options);
		strUrl = url.resolve(strContextUrl, strUrl);
	}
	
	strUrl = _ensureProtocol(strUrl, options);

	var oUrl = url.parse(strUrl);
	oUrl.slashes = true;
	oUrl.protocol = oUrl.protocol || options.protocol; 

	delete oUrl.host;
	if (oUrl.protocol == 'http:' && oUrl.port == 80){
		delete oUrl.port;
	} else if (oUrl.protocol == 'https:' && oUrl.port == 443){
		delete oUrl.port;
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
