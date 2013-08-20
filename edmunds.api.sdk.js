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
	var _version = "0.1.5";
	
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
	 *
	 * @property _base_url
	 * @private
	 * @type string
	 */
	var _base_url = "//api.edmunds.com";
	
	/**
	 * The base URL for photos
	 *
	 * @property _base_url
	 * @private
	 * @type string
	 */
	var _base_media = "//media.ed.edmunds-media.com";
	
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
	
	this.callbackId = 0;
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
    	var callbackfn = 'C' + (new Date().getTime());

		var script = document.createElement('script');
		script.src = baseUrl + method + queryString +'&callback='+callbackfn;
		window[callbackfn] = function(data) {
            successCallback(data);
        };
		script.onerror = function(e) {
            abort(e);
        };
		
		// Add the script asynchronously 
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(script, s);
		//return this.jsonp({
       //    url: baseUrl + method + queryString,
       //    timeout: 7000,
       //    success: successCallback,
       //    error: errorCallback,
	   //	cache: true
       //});
	};
}

if (typeof window.sdkAsyncInit === "function") {
	sdkAsyncInit();
}