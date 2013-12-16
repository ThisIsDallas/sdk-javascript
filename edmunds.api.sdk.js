/*
*  This module is a collection of classes designed to make working with
*  the Appigee App Services API as easy as possible.
*  Learn more at http://apigee.com/docs/usergrid
*
*   Copyright 2013 Edmunds.com, Inc
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*
*  @author Ismail Elshareef (ielshareef@edmunds.com)
*  @author Michael Bock (mbock@edmunds.com)
*/

/**
 * The browser console
 *
 * @property console
 * @private
 * @type object
 */
window.console = window.console || {};
window.console.log = this.console.log || function() {};

/**
 * Core functionality for the Edmunds API JavaScript SDK
 *
 * @class EDMUNDSAPI
 */
function EDMUNDSAPI(key) {
	
	/**
	 * The SDK version
	 *
	 * @config _version
	 * @private
	 * @type string
	 */
	var _version = "0.1.7";
	
	/**
	 * Assigned API Key. Register for an API Key <a href="http://developer.edmunds.com/apps/register">here</a>
	 *
	 * @config _api_key
	 * @private
	 * @type string
	 */
	var _api_key = key;

	/**
	 * The base URL for the API
	 * http or https depending on the site, defaulting to http: if other.
	 *
	 * @property _base_url
	 * @private
	 * @type string
	 */
	if (window.location.protocol == "http:" || window.location.protocol == "https:") {
		var _base_url = window.location.protocol + "//api.edmunds.com";
	}
	else {
		var _base_url = "http://api.edmunds.com";
	}
	
	/**
	 * The base URL for photos
	 *
	 * @property _base_url
	 * @private
	 * @type string
	 */
	var _base_media = window.location.protocol + "//media.ed.edmunds-media.com";
	
	/**
	 * The API response format
	 *
	 * @property _response_format
	 * @private
	 * @type string
	 */
	var _response_format = 'json';
	
	/**
	 * Set the response format (json or xml)
	 *
	 * @method setOutput
	 * @param void
	 * @return {string} API version
	 */
	this.setOutput = function(format) {
		_response_format = format;
		return _response_format;
	};

	/**
	 * Serialize a JSON object into a key=value pairs
	 *
	 * @method _serializeParams
	 * @private
	 * @param object JSON object of parameters and their values
	 * @return {string} Serialized parameters in the form of a query string
	 */
	function _serializeParams(params) {
		var str = '';
		for(var key in params) {
			if(params.hasOwnProperty(key)) {
				if (str !== '') str += "&";
		   		str += key + "=" + params[key];
			}
		}
		return str;
	}

	/**
	 * The base URL for the API
	 *
	 * @method getBaseUrl
	 * @param void
	 * @return {string} API URL stub
	 */
	this.getBaseUrl = function() {
		return _base_url;
	};
	
	/**
	 * The base URL for photos
	 *
	 * @method getVersion
	 * @param void
	 * @return {string} API version
	 */
	this.getBaseMediaUrl = function() {
		return _base_media;
	};
	
	/**
	 * Make the API REST call
	 *
	 * @method api
	 * @param string method The API resource to be invoked
	 * @param object params JSON object of method parameters and their values
	 * @param function callback The JavaScript function to be invoked when the results are returned (JSONP implementation)
	 * @return {string} API REST call URL
	 */
	this.api = function(method, params, successCallback, errorCallback) {
        var queryString = _serializeParams(params),
            baseUrl = this.getBaseUrl();
        queryString = (queryString) ? '?' + queryString + '&api_key=' + _api_key + "&fmt=" + _response_format : '?api_key=' + _api_key + "&fmt=" + _response_format;
        return this.jsonp({
            url: baseUrl + method + queryString,
            timeout: 7000,
            success: successCallback,
            error: errorCallback,
			cache: true
        });
	};
	
	/**
	 * Make the JSONP call
	 *
	 * @method jsonp
	 * @param object options 
	 *	{
	 *		"url" : [the API call],
	 *		"timeout": [time in milliseconds of how long to wait for the script to execute],
	 *		"success": [the function to be invoked upon success],
	 *		"error": [the function to be invoked upon error],
	 *		"cache": [let the Mashery cache be or bust it. Boolean value with default is FALSE (keep the cache)],
	 * 	}
	 *						
	 * @return {string} API REST call URL
	 */
	this.jsonp = (function(global) {
	    'use strict';

	    var callbackId = 0,
	        documentHead = document.head || document.getElementsByTagName('head')[0];

	    function createScript(url) {
	        var script = document.createElement('script');
	        script.setAttribute('type', 'text/javascript');
	        script.setAttribute('async', true);
	        script.setAttribute('src', url);
	        return script;
	    }

	    return function(options) {
	        options = options || {};

	        var callbackName = 'callback' + (new Date().getTime())+ (++callbackId),
	            url = options.url + '&callback=' + callbackName + (options.cache ? '' : '&_dc=' + new Date().getTime()),
	            script = createScript(url),
	            abortTimeout;

	        function cleanup() {
	            if (script) {
	                script.parentNode.removeChild(script);
	            }
	            clearTimeout(abortTimeout);
	            delete global[callbackName];
	        }

	        function success(data) {
	            if (typeof options.success === 'function') {
	                options.success(data);
	            }
	        }

	        function error(errorType) {
	            if (typeof options.error === 'function') {
	                options.error(errorType);
	            }
	        }

	        function abort(errorType) {
	            cleanup();
	            if (errorType === 'timeout') {
	                global[callbackName] = function() {};
	            }
	            error(errorType);
				window.console.log(errorType+": One of the scripts failed to load ("+callbackName+")");
	        }

	        global[callbackName] = function(data) {
	            cleanup();
	            success(data);
	        };

	        script.onerror = function(e) {
	            abort(e);
	        };

	        documentHead.appendChild(script);

	        if (options.timeout > 0) {
	            abortTimeout = setTimeout(function() {
	                abort('timeout');
	            }, options.timeout);
	        }

	    };

	}(window));
}

if (typeof window.sdkAsyncInit === "function") {
	sdkAsyncInit();
}
