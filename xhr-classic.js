
const baseroute = 'http://yoursitewithapi:YOURPORTNUMBER/'

const api = new class API {

    transfer (profile,backprogress,backdata) {

		if (!profile[0]||!profile[1]) {

			console.error("API CONNECTOR WRONG - NO CORRECT PROFILE SETTED");

		} else if( profile[1].file && profile[1].file.count>0 ) {

			console.error("API CONNECTOR WRONG - ONLY ONE FILE FOR CONNECTION")

		} else {


			var request = new XMLHttpRequest(),
				connect = this.connectors(profile[0].action),
				params  = profile[1]||false,
				data = new FormData(),
				query = ''


			// set xhr debug level

			request.debuglevel = 0

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


				if ( result && request.status === 200 && request.readyState === XMLHttpRequest.DONE ) {

					backdata(result)

				} else {

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

					this.debug( request, result )

					backdata( result )

				}
			}

			request.send(data)

		}

	}

	debug (request,result) {

		switch (request.debuglevel) {

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

			default:

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
		
		}

	}


	connectors ( action ) {

		this.route 	= baseroute
		this.method = undefined
		this.mode 	= undefined

		return this.connectors_ENDPOINT_SECTOR(action) /* || other connectors */ ? this : console.error("API CONNECTOR WRONG - NO ENDPOINT FINDED")

	}


	connectors_ENDPOINT_SECTOR(action) {

		switch (action) {


			case 'ENDPOINT_SECTOR-ENDPOINT_API_PAGE':
				this.route += 'ENDPOINT_SECTOR/ENDPOINT_API_PAGE'
				this.method = 'post'
				this.mode = true
			break

			//others...

			/* - - - - - - - - - - - - - */

			default: undefined;

		}

		return this.method!=undefined ? this : false

	}

}
