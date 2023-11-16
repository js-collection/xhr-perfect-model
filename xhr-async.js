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

const baseroute = 'http://yoursitewithapi:YOURPORTNUMBER/'

const api = new class API {

    transmitted = (profile) => this.transfer(profile).results()

    transfer ( profile, backprogress, backresult ) {

		this.process = new Promise( resolve => {
			
			if ( (!profile[0] || !profile[1]) || (profile[1].file && profile[1].file.count>0) ) {


				request.status   = 501
				response.status  = false
				response.payload = false
				response.message = "CLIENT API ERROR: CONNECTOR WRONG ~ "+ ( !profile[0] || !profile[1] ? "NO CORRECT PROFILE SETTED":"ONLY ONE FILE FOR CONNECTION" )

				this.debugs(request,response)
				resolve(response.message)


			} else {


				var request = new XMLHttpRequest(),
					connect = this.connectors(profile[0].action),
					params  = profile[1]||false,
					data = new FormData(),
					query = ''


				// set xhr debug level

				request.debuglevel = 1

				// open xhr file/params trasmition

				if ( params.file ) {

					data = params.file

					query = '?' + new URLSearchParams( (delete params.file, params) ).toString()
					request.open( connect.method.toUpperCase(), connect.route+query, true)
					request.setRequestHeader('content-type','multipart/form-data')

				} else {

					data = JSON.stringify( params )

					request.open( connect.method.toUpperCase(), connect.route, true)
					request.setRequestHeader('content-type','application/json')

				}

				// manage xhr status

				request.upload.addEventListener( 'progress', stream => {

					if (stream.lengthComputable) {

						let totalbyte 	= ( stream.totalSize||stream.total ),
							loadedbyte  = ( stream.position||stream.loaded ),
							percentage  = ( loadedbyte/totalbyte * 100 ).toFixed(1)

						if ( typeof this.updateProgress == 'function' ) {

							this.updateProgress({
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
	
							backresult( response )
	
						}

						resolve ( response )

					} else {

						this.debugs( request, response )

						if ( typeof backresult == 'function' ) {

							backresult( response )

						}

						resolve ( response )

					}


				}

				request.send(data)

			}

		})

		this.progress = callback => {
			this.updateProgress = callback
			return this
		}

		this.result = () => {
			return this.process
		}

		return this

	}

	debugs ( request, response ) {

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

		switch (request.debuglevel) {

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

			default:

				console.groupCollapsed('API connection')
				console.log(
					'┈╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┈ ┈ ┈'+'\n'+
					' ├ ACTION  : '+request.action+'\n'+
					' ├ WIRED   : '+request.wire.route.replace(baseroute,'~/')+'\n'+
					' ├ TYPE    : '+request.wire.method.toLowerCase()+'; '+request.mode=="async"?"async":"linear"+'; '+request.file?"multipart":"json"+';\n'+
					' ├ STATUS  : '+request.status+' ~ '+request.warning+'\n'+
					' ├ MESSAGE : '+( response.message ? response.message : 'nothing else...' )+'\n'+
					'┈╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┈ ┈ ┈'+'\n'+
					' └ PAYLOAD   :',response
				)
				console.groupEnd()

			break
		
		}

	}

	connectors ( action ) {

		this.route 	= baseroute
		this.method = undefined
		this.mode 	= undefined

		return this.connectors_MYAPISECTOR(action) /* || other connectors */ ? this : (()=>{

			request.status    = 500
			response.status   = false
			response.payload  = false
			response.message  = "CLIENT API ERROR: CONNECTOR WRONG ~ NO ENDPOINT SECTOR FINDED"
			this.debug(request,response)

		})()

	}


	connectors_MYAPISECTOR(action) {

		switch (action) {


			case 'MYAPISECTOR-ENDPOINTNAME':
				this.route += 'MYAPIPATH/ENDPOINTPAGE'
				this.method = 'post'
				this.mode = true
			break

			// Other...

			/* - - - - - - - - - - - - - */

			default: undefined;

		}

		return this.method!=undefined ? this : false

	}

}
