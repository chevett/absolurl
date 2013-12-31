var url = require('url'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;
var tlds = require('./tlds');
var o = new EventEmitter();
var protocolsToIgnore = {
	"javascript": true,
	"mailto": true,
	"data": true,
	"tel": true
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

function _trim(str){
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

function _parse(completeUrl){

	// todo: handle user@pass one day
	var regex = /^((\w+:)\/\/)?(([^\.]*(\.[^:\?\/]+)+)|localhost)(:(\d+))?([^\?]*)(\??(.*))$/;
	var match = _trim(completeUrl).match(regex);
	var o = {
		protocol: (match[2] || ''),
		slashes: true,
		host: (match[3] || '') + (match[5] || ''),
		hostname: (match[3] || ''),
		port: (match[7] || ''),
		seach: (match[9] || ''),
		query: (match[10] || ''),
		path: (match[8] || '')  + (match[9] || ''),
		pathname: (match[8] || '')
	};

	return o;
}

function _format(s){
	var port = s.port ? ':'+ s.port : '';
	return s.protocol + '//' + s.hostname + port + s.path;
}

function _ensureComplete(strUrl, strContextUrl, options){
	try {
		return _onEnsureComplete(strUrl, strContextUrl, options);
	}
	catch (e){
		e.message = 'failed while attempting to complete "' + strUrl + '" with "' + strContextUrl + '".';
		e.name = 'absolurlException';
		o.emit('error', e);
		return strUrl;
	}
}

function _onEnsureComplete(strUrl, strContextUrl, options){
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
	var psuedoProtocolMatch = strUrl.match(/^\s*(\w*):/i);

	return psuedoProtocolMatch && protocolsToIgnore[(psuedoProtocolMatch[1] || 'nope').toLowerCase()];
}

function _isAbsolute(strUrl){
	if (!strUrl) return strUrl;

	if (_hasPsuedoProtocol(strUrl)) return true;

	var match = strUrl.match(/^((\w+:)?\/\/)?([^:\/?$]*)/);
	if (!match || !match[3]) return false;

	var domain = match[3];

	if (domain === 'localhost') return true; // sure sure, whatever

	// if the domain is an ip address
	if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain)) return true;

	if (domain === 'localhost') return true;

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

o.isAbsolute = _isAbsolute;
o.isRelative = _isRelative;
o.hasProtocol = _hasProtocol;
o.ensureComplete = _ensureComplete;

module.exports = o;
