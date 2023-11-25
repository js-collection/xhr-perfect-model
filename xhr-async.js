//:
//: THIS IS A FUNCTIONAL MODEL FOR A WALKIE TALKIE RESTFUL API SYSTEM
//: It's ready to use if you have a standard rest api
//:
//: some reference:
//: https://www.restapitutorial.com/lessons/httpmethods.html
//:
//: Some good roles for a good unversal response from server:
//: 1) in header set, minimum, this status codes: (0,1,2,3,4,400,401,402,403,404,500,501,508)
//: 2) my server response {
//: 	status:  true, 				// false if fail, true if computable! not code here!
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
						url    : this.config.baseroute+(('/'+sector.path+'/'+routed.endpoint).replace(/\/\//g, "/")),
						method : routed.method.toUpperCase(),
						mode   : routed.mode
					}

				}

			}

		}

		this.log({},{},500,"CLIENT API ERROR: WIRED ROUTE/API WRONG ~ NO SECTOR/ENDPOINT FINDED")

		return false

	}

	transfer ( profile, backprogress, backresult ) {

		this.process = new Promise( resolve => {


			if ( !profile.target || !profile.params || profile.params.file && profile.params.file.count>0 ) {


				let message = "CLIENT API ERROR: CONNECTOR WRONG ~ "+ ( !profile.target || !profile.params ? "NO CORRECT PROFILE SETTED" : "ONLY ONE FILE FOR CONNECTION" )

				this.log({},{},501,message)

				resolve(message)


			} else {


				var request = new XMLHttpRequest(),
					routed  = this.router( profile.sector, profile.target ),
					data    = undefined,
					query   = ''


				// set xhr extras

				
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

					request.open( request.method, request.route, (request.mode=='async'?true:false) )
					request.setRequestHeader('content-type','application/json')


				}


				// manage xhr status


				request.upload.addEventListener( 'progress', stream => {

					if ( stream.lengthComputable ) {

						let totalbyte 	= ( stream.totalSize||stream.total ),
							loadedbyte  = ( stream.position||stream.loaded ),
							percentage  = ( loadedbyte/totalbyte * 100 ).toFixed(1)

						if ( typeof this.progression == 'function' ){

							this.progression({
								totalbytes: totalbyte,
								loadedbytes: loadedbyte,
								percentage: percentage
							})

						} else if ( typeof backprogress == 'function' ) {

							backprogress({
								totalbytes: totalbyte,
								loadedbytes: loadedbyte,
								percentage: percentage
							})

						}

					}

				})


				request.onload = response => {


					try {

						response = JSON.parse( request.response.toString("utf-8"), null, 4)

					} catch {

						response = false

					}


					if ( response && request.status === 200 && request.readyState === XMLHttpRequest.DONE ) {


						if ( typeof backresult == 'function' ) {

							backresult ( response )

						}

						resolve ( response )


					} else {


						this.log( request, response )

						if ( typeof backresult == 'function' ){

							backresult ( response )

						}

						resolve ( response )


					}


				}


				request.send ( data )


			}

		})

		this.progress = callback => {

			this.progression = callback
			return this

		}

		this.results = () => {

			return this.process

		}

		return this

	}
	
	transmitted ( profile ) {

		return this.transfer(profile).results()

	}

	log ( request, response, status, message ) {

		if ( status && message ){

			request.debugger = 2
			request.status   = status
			response.status  = false
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
					'      ├ MESSAGE : '+( response.message ? response.message : 'nothing else...' )+'\n'+
					'┈╌─────────────┈ ┈ ┈'
				)
			
			break

			case 3:

				console.groupCollapsed('API connection')
				console.log(
					'┈╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┈ ┈ ┈'+'\n'+
					' ├ ACTION  : '+request.action+'\n'+
					' ├ WIRED   : '+request.route.replace(baseroute,'~/')+'\n'+
					' ├ TYPE    : '+request.method.toLowerCase()+'; '+request.mode=="async"?"async":"linear"+'; '+request.file?"multipart":"json"+';\n'+
					' ├ STATUS  : '+request.status+' ~ '+request.warning+'\n'+
					' ├ MESSAGE : '+( response.message ? response.message : 'nothing else...' )+'\n'+
					'┈╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┈ ┈ ┈'+'\n'+
					' └ PAYLOAD   :',response
				)
				console.groupEnd()

			break

			default: null

		
		}

	}

}

api.configuration({

	// THIS IS A MODEL, SET YOUR CONFIG HERE OR IN EXTERNAL FILE

	// baseroute: 'http://myapiurl:myport',
	// debugger: 2, //from 0 to 3

	// sectors: [{

	// 	name: 'mySectorName',
	// 	path: '/my/api/real/sector/path/',
	// 	actions: [{
	// 		endpoint: 'myRealEndpointFile',
	// 		method: 'POST',
	// 		mode: 'async'
	// 	},{
	// 		endpoint: 'myOtherRealEndpointFileSync',
	// 		method: 'POST',
	// 		mode: 'linear'
	// 	},/*your other api endpoints*/]

	// },/*your other api sectors*/]
})
