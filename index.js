var url = require('url');
var tlds = require('./tlds');

function _ensureComplete(strUrl, strContextUrl){
	if (_isRelative(strUrl) && (!strContextUrl || _isRelative(strContextUrl))){
		return null;
	} else if (_isRelative(strUrl)){
		strContextUrl = _ensureProtocol(strContextUrl);
		strUrl = url.resolve(strContextUrl, strUrl);
	}
	
	strUrl = _ensureProtocol(strUrl);

	var oUrl = url.parse(strUrl);
	oUrl.slashes = true;
	oUrl.protocol = oUrl.protocol || 'http:';

	delete oUrl.host;
	if (oUrl.protocol == 'http:' && oUrl.port == 80){
		delete oUrl.port;
	} else if (oUrl.protocol == 'https:' && oUrl.port == 443){
		delete oUrl.port;
	}

	return url.format(oUrl);
}

function _ensureProtocol(strUrl){
	if (!/^\w{3,6}:\/\//.test(strUrl)){
		return 'http://' + strUrl;
	}

	return strUrl;
}
function _isAbsolute(strUrl){
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
