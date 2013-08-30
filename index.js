var url = require('url');
var tlds = require('./tlds');

function _ensureComplete(strUrl, strContextUrl){
	if (_isRelative(strUrl) && (!strContextUrl || _isRelative(strContextUrl))){
		return null;
	} else if (_isRelative(strUrl)){
		strUrl = url.resolve(strContextUrl, strUrl);


	}
	
//	var oContextUrl = url.parse(strContextUrl);

	if (!/^\w{3,6}:\/\//.test(strUrl)){
		strUrl = 'http://' + strUrl;
	}

	var oUrl = url.parse(strUrl);
	console.log(oUrl);
	oUrl.slashes = true;
	oUrl.protocol = oUrl.protocol || 'http:';

	delete oUrl.host;
	if (oUrl.protocol == 'http:' && oUrl.port == 80){
		delete oUrl.port;
	} else if (oUrl.protocol == 'https:' && oUrl.port == 443){
		delete oUrl.port;
	}
	console.log(oUrl);

	return url.format(oUrl);
}


function _isAbsolute(strUrl){
	var match = strUrl.match(/^((\w{3,6}:)?\/\/)?([^:\/?$]*)/);
	if (!match || !match[3]) return false;
	
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
exports._isRelative =_isRelative;
exports.hasProtocol =_hasProtocol;
exports.ensureComplete =_ensureComplete;
