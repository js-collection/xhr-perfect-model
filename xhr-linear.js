//:
//: THIS IS A FUNCTIONAL MODEL FOR A WALKIE TALKIE RESTFUL API SYSTEM
//: It's ready to use if you have a standard rest api
//:
//: some reference:
//: https://www.restapitutorial.com/lessons/httpmethods.html
//:
//: Some good roles for a good unversal response from server:
//: 1) in header set, minimum, this status codes: (0,1,2,3,4,400,401,402,403,404,500,501,504,508)
//: 2) my server response {
//: 	errors:  true, 				// false if fail, true if computable! not code here!
//: 	message: "we recived good", // false if nothing, message for success/error!
//: 	payload: [data,data,data] 	// false if empty, array of items with datas
//:   }
//:
//: tips
//: do you want external congifig? it's easy!! read the reference!

const api = new class API {

	configuration(object){

		return this.config = object

	}

	router ( sectorName, targetName ) {

		let sector,routed

		for ( sector of this.config.sectors ) {

			if ( sector.name == sectorName ) {

				if ( routed = sector.actions.find( voice => voice.endpoint === targetName ) ) {

					return {
						url    : (this.config.baseroute.replace(/\/$/, ''))+('/'+sector.path+'/'+routed.endpoint).replace(/\/\//g, "/"),
						method : routed.method.toUpperCase(),
						mode   : routed.mode
					}

				}

			}

		}

		this.log({},{},500,"CLIENT API ERROR: WIRED ROUTE/API WRONG ~ NO SECTOR/ENDPOINT FINDED")

		return false

	}


	transfer (profile,backprogress,backdata) {

		if ( !this.config || !Object.entries(this.config).length === 0 ) {

			this.log({},{},501,"CLIENT API ERROR: NO CONFIG FOUND")
			return

		}

		if ( !profile.target || !profile.params || profile.params.file && profile.params.file.count>0 ) {


			let message = "CLIENT API ERROR: CONNECTOR WRONG ~ "+ ( !profile.target || !profile.params ? "NO CORRECT PROFILE SETTED" : "ONLY ONE FILE FOR CONNECTION" )

			this.log({},{},501,message)

			resolve(message)


		} else {


			var request = new XMLHttpRequest(),
				routed  = this.router( profile.sector, profile.target ),
				data    = undefined,
				query   = ''


			// set xhr debug level


			request.debugger = this.config.debugger||0
			request.method 	 = routed.method.toUpperCase()||'no method finded!'
			request.route 	 = routed.url||'no route finded!'
			request.mode 	 = routed.mode||true


			// open xhr file/params trasmition


			if ( profile.params.file ) {


				data = profile.params.file

				query = '?' + new URLSearchParams( (delete profile.params.file, profile.params) ).toString()
				request.open( request.method, request.route+query, (request.mode=='async'?true:false) )
				request.setRequestHeader('content-type','multipart/form-data')


			} else {


				data = JSON.stringify( profile.params )

				request.open( request.method, request.route, (request.mode=='async'?true:false))
				request.setRequestHeader('content-type','application/json')


			}


			// override or extend headers


			if ( this.config.header.length % 2 === 0 ) {

				for ( let i = 0; i < this.config.header.length; i += 2 ) {

					request.setRequestHeader( this.config.header[i] , this.config.header[i + 1] )

				}

			} else if ( this.config.header.length > 0 ) {

				this.log({},{},501,"CLIENT API ERROR: CUSTOM HEADERS NEED PAIR KEY:VALUE, SO: [ key,value, key,value, key,value, ...]")

			}


			// manage xhr status


			request.upload.addEventListener( 'progress', stream => {

				if ( stream.lengthComputable && typeof backprogress == 'function' ) {

					let totalbyte 	= ( stream.totalSize||stream.total ),
					    loadedbyte  = ( stream.position||stream.loaded ),
					    percentage  = ( loadedbyte/totalbyte * 100 ).toFixed(1);

					backprogress({
						totalbytes  : totalbyte,
						loadedbytes : loadedbyte,
						percentage  : percentage
					})

				}

			})


			request.onload = result => {


				try {

					result = JSON.parse( request.response.toString("utf-8"), null, 4)

				} catch {

					result = false

				}


				if ( typeof backresult == 'function' ) {

					if ( result && request.status === 200 && request.readyState === XMLHttpRequest.DONE ) {


						backdata(result)


					} else {


						this.log( request, result )

						backdata( result )


					}

				}


			}


			request.ontimeout = () => {

				this.log({},{},504,"CLIENT API MESSAGE: CONNECTION IS DONE IN TIMEOUT")

			}


			request.send ( data )


		}


	}


	log ( request, response, status, message ) {

		if ( status && message ){

			request.debugger = 2
			request.status   = status
			response.errors  = false
			response.payload = false
			response.message = message

		}

		switch (request.status) {

			case 0:   request.warning = 'Request URL not exist / corrupted response';  break;
			case 1:   request.warning = 'Request not initialized'; break;
			case 2:   request.warning = 'Request not recived'; break;
			case 3:   request.warning = 'Request not processed'; break;
			case 4:   request.warning = 'Request not finished / Response lost'; break;
			case 400: request.warning = 'Bad Request / Action wrong'; break;
			case 401: request.warning = 'Not Authorized Request'; break;
			case 403: request.warning = 'Lost or blocked Request'; break;
			case 404: request.warning = 'File/Page not found'; break;
			case 500: request.warning = 'Inner server error'; break;
			case 501: request.warning = 'Bad API requesting'; break;
			case 504: request.warning = 'Server didn\'t respond'; break;
			case 508: request.warning = 'Server Resouces Overloaded'; break;
			default: 'Unknown error ~ status: "'+request.status+'" / message: "'+request.message+'"'; break;

		}

		switch (request.debugger) {

			case 1:

				console.log('[api] :: '+request.status+' ~ ' +request.action)

			break

			case 2:

				console.log(
					'┈╌─────────────┈ ┈ ┈ \n'+
					'[api] ├ STATUS  : '+request.status+' ~ '+request.action+'\n'+
					'      ├ MESSAGE : '+( result.message ? result.message : 'nothing else...' )+'\n'+
					'┈╌─────────────┈ ┈ ┈'
				)
			
			break

			case 3:

				console.groupCollapsed('API connection')
				console.log(
					'┈╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┈ ┈ ┈'+'\n'+
					' ├ ACTION  : '+request.action+'\n'+
					' ├ WIRED   : '+request.wire.route.replace(baseroute,'~/')+'\n'+
					' ├ TYPE    : '+request.wire.method.toLowerCase()+'; '+request.mode=="async"?"async":"linear"+'; '+request.file?"multipart":"json"+';\n'+
					' ├ STATUS  : '+request.status+' ~ '+request.warning+'\n'+
					' ├ MESSAGE : '+( result.message ? result.message : 'nothing else...' )+'\n'+
					'┈╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┈ ┈ ┈'+'\n'+
					' └ PAYLOAD   :',result
				)
				console.groupEnd()

			break

			default: null
		
		}

	}


}

// api.configuration({
//
// 	// THIS IS A MODEL, SET YOUR CONFIG HERE OR IN EXTERNAL FILE
//
// 	baseroute: 'http://myapiurl:myport',
//
//	other options:
//  debugger: 2,                         // from 0 (no logs) to 3 (full logs)
//  timeout: 7000,                       // custom timeout of call
//  header: [                            // if you need extend the headers of call
//    key, value,
//    key, value,
//    key, value
//  ],
//
// 	sectors: [{
//
// 		name: 'mySectorName',
// 		path: '/my/api/real/sector/path/',
// 		actions: [{
// 			endpoint: 'myRealEndpointFile',
// 			method: 'POST',
// 			mode: 'async'
// 		},{
// 			endpoint: 'myOtherRealEndpointFileSync',
// 			method: 'POST',
// 			mode: 'linear'
// 		},/*your other api endpoints*/]
//
// 	},/*your other api sectors*/]
//
// })

export default api; typeof window === 'undefined' ? null : window.api = api