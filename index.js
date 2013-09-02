var url = require('url');
var tlds = require('./tlds');
var protocolsToIgnore = {
	"javascript": true,
	"data": true
};

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
	// todo: handle user@pass one day
	var regex = /^((\w+:)\/\/)?([^\.]*(\.[^:\?\/]+)+)(:(\d+))?([^\?]*)(\??(.*))$/;
	var match = completeUrl.match(regex);
	var o = {
		protocol: (match[2] || ''),
		slashes: true,
		host: (match[3] || '') + (match[5] || ''),
		hostname: (match[3] || ''),
		port: (match[6] || ''),
		seach: (match[8] || ''),
		query: (match[9] || ''),
		path: (match[7] || '')  + (match[8] || ''),
		pathname: (match[7] || '')
	};

	return o;
}

function _format(o){
	var port = o.port ? ':'+ o.port : '';
	return o.protocol + '//' + o.hostname + port + o.path;
}

function _ensureComplete(strUrl, strContextUrl, options){
	if (!strUrl) return strUrl;
	if (_hasPsuedoProtocol(strUrl)) return strUrl;

	options = _getOptions(options);

	if (_isRelative(strUrl)){
		if (!strContextUrl || _isRelative(strContextUrl)) return null;

		strContextUrl = _ensureProtocol(strContextUrl, options);
		strUrl = url.resolve(strContextUrl, strUrl);
	}
	
	strUrl = _ensureProtocol(strUrl, options);

	var oUrl = _parse(strUrl);
	oUrl.slashes = true;
	oUrl.protocol = oUrl.protocol || options.protocol; 

	if (oUrl.protocol == 'http:' && oUrl.port == 80){
		delete oUrl.port;
	} else if (oUrl.protocol == 'https:' && oUrl.port == 443){
		delete oUrl.port;
	}

	return _format(oUrl);
}

function _ensureProtocol(strUrl, options){
	if (/^\s*\/\//.test(strUrl)){
		return options.protocol + strUrl;
	} else if (!/^\w{3,6}:\/\//.test(strUrl)){
		return options.protocol +'//' + strUrl;
	}

	return strUrl;
}
function _hasPsuedoProtocol(strUrl){
	var psuedoProtocolMatch = strUrl.match(/^\s*(\w*):/);
	
	return psuedoProtocolMatch && protocolsToIgnore[psuedoProtocolMatch[1] || 'nope'];
}

function _isAbsolute(strUrl){
	if (!strUrl) return strUrl;

	if (_hasPsuedoProtocol(strUrl)) return true;

	var match = strUrl.match(/^((\w+:)?\/\/)?([^:\/?$]*)/);
	if (!match || !match[3]) return false;

	var domain = match[3];

	// if the domain is an ip address
	if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain)) return true;

	var domainSplit = domain.split('.');

	if (domainSplit.length === 1) return false;
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
