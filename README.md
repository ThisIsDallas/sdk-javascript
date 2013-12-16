# Edmunds API JavaScript SDK

A simple wrapper to help you make API calls against the Edmunds API. The SDK is all open-source on GitHub, and all are welcome to contribute. Except as otherwise noted, the Edmunds API JavaScript SDK is licensed under the [Apache 2.0 License.][license]

Before using the SDK, it's highly recommended that you check out the following:

1. [The API Documentation][docs]
2. [The API Console][console]

## Quick Start

Add the SDK asynchronously to your page:

	// Load the SDK asynchronously
	(function(d, s, id){
	   	var js, sdkjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) {return;}
	    js = d.createElement(s); js.id = id;
	 	js.src = "../../edmunds.api.sdk.js";
		sdkjs.parentNode.insertBefore(js, sdkjs);
	}(document, 'script', 'edmunds-jssdk'));
	
You also need to define the sdkAsyncInit function that the SDK calls when done loading on your page. Here's an example to get the top 5 articles in the Awards category of Edmunds Articles

	window.sdkAsyncInit = function() {
    	// Instantiate the SDK
		var res = new EDMUNDSAPI('YOUR EDITORIAL API KEY');
	
		// Get articles
		var options = {
			"category": "awards",
			"limit": "0,5"
		};
	
		// Callback function to be called when the API response is returned
		function success(reviews) {
			var len = reviews.length;
			var html = [];
			for (i=0; i<len; i++) {
				html.push('<a href="'+reviews[i].link+'"><h2>'+reviews[i].title+'</h2></a>');
				html.push(	'<div class="body">'+reviews[i].content+'</div>');
			}
			var body = document.getElementById('review-body');
			body.innerHTML = html.join('');
		}
	
		// Oops, Houston we have a problem
		function fail() {
			console.log(data);
		}
	
		// Fire the API call
		res.api('/v1/content/', options, success, fail);

	    // Additional initialization code goes here
  };

## What's Here

* examples/: HTML examples of how to use the SDK. Still a work in progress!
* .gitignore: Runtime files and folders that do not need to be part of this repository
* LICENSE: License agreement for using this SDK
* NOTICE: A reference to the License Agreement
* HISTORY.md: A version history
* AUTHORS.md: Info about the developers and how to contribute!
* README.md: You're looking at it :)

## SDK Status

This is a *beta* release. We have opened sourced it at this stage to guide the development of the library and allow you to freely inspect and use the source.

## Documentation

The API documentation is available [here][docs].

[license]: http://www.apache.org/licenses/LICENSE-2.0.html "Apache 2.0 License"
[docs]: http://developer.edmunds.com/docs "API Documentation"
[console]: http://developer.edmunds.com/io-docs "API Console"
