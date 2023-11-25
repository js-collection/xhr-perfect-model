[<sub>![](https://img.shields.io/badge/❮❮_BACK_TO_COLLECTION_HOMEPAGE-lavender.svg)</sub>](https://github.com/js-collection)
---
# xhr-perfect-model

<a href="https://github.com/sponsors/js-collection">
  <img src="./.depot/banner.jsperfectxhr.webp" alt="javascript xhr open source api system">
</a>

<table>
  <tr>
    <td width="999" align="center"> <a href="https://github.com/js-collection/xhr-perfect-model/releases"> 💾 Stable relesed list </a> </td>
    <td width="999" align="center"> <a href="https://github.com/js-collection/xhr-perfect-model/tree/released"> 💎 Latest release </a> </td>
    <td width="999" align="center"> <a href="https://github.com/js-collection/xhr-perfect-model/tree/development"> ⚙️ Unstable / Devs </a> </td>
    <td width="999" align="center"> <a href="./licence.md"> ⚖️ Licence roles </a> </td>
  </tr>
</table>

---

## 📃 Info:

#### WHAT IS IT?
This is an asset model for make the smallest xhr walkie-talkie system (so it collects the data of a form and packages it for sending to the server and waits for or tracks a response) into the client side pages. <br>

#### WHY CHOOSE IT?
Unlike some other competitors, this system does not have compilers, special protocols or framework but it's a simple micro-library. Its strength is in its simplicity... It is a simple "walkie-talkie" method created in simple vanilla Js and web APIs. Anyway, you can get the results of call, the progession of it and, from this version, we introduce a super little router (a simple loop of object like a json) for track your api's paths and enpoints. All of this system doesn't have affect on server sides and only requires a response json similar to common standards such as those suggested in the code and in the manual. That's all ;)<br>

#### WHO DID THAT?
This is an open project built by Alberto Marangelo (@berto-dev) [¹](https://berto.dev) [²](https://github.com/berto-dev) for Deveet Technologies [¹](https://deveet.com) [²](https://github.com/Deveet-Technologies)<br>
<sup>If you use in your blog it's a good idea to include <i>"taken from original GITPAGE of the AUTHORSLINK"</i></sup>
<br><br>

## 🆘 Before flight:
- **Remember**: This is the client side script, it's not the server side!<br>
- **Remember** to change your api base root the class in place of the [`http://yoursitewithapi:YOURPORTNUMBER/`](https://github.com/js-collection/xhr-perfect-model/blob/development/xhr-classic.js#L2) placeholder.<br>
- **Remember** to register your api into the class in place of the [`connectors_ENDPOINT_SECTOR`](https://github.com/js-collection/xhr-perfect-model/blob/development/xhr-classic.js#L175) placeholder. You can registre infinite api sectors.<br>
- **SYNC ASYNC IN SHORT**: Sync and Async scripts are both the same but the first it's liniear and much simple to undestanding. Instead, the async offer more possibilities and rapidity to execution, but need to be encapsulated into an async function wrapper and inside have more complex syntax... For someone the async rappresent a [chaos and hard programming style](https://www.google.com/search?q=async+it%27s+too+complex&oq=async+it%27s+too+complex&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg80gEJMTA3MTdqMGo0qAIAsAIA&sourceid=chrome&ie=UTF-8#ip=1) but, again, for other one, Sync is not good because can encurred in a ["callback hell"](https://www.google.com/search?q=what%27s+callback+hell&oq=callback+hell+what&gs_lcrp=EgZjaHJvbWUqCAgBEAAYFhgeMgYIABBFGDkyCAgBEAAYFhge0gEIMzY3OGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8)... it's a choose.<br><br>

## *️⃣ What it do:
This is a simplest, but complete, model to make client side walkie talkie ( it's a method to send and receiving information to/from server ) restful system.
<br><br>
<img src="./.depot/banner.modernrestsys.webp" alt="modern restful system">
<br><br>
So, in short, you collect the data from form or function, put it in the class, the class "transfer" via a presetted xhr protocol the data and waiting a response from it. When the response reached it's served to you. In the same time, if you have a progression ( an exemple a big json or files ) you can get it easly ( it's all just presetted ;) ). That's the piece of cake.
<br><br>
You can use all you want into the form, or not use the form with a complete new custom function, it's not important! This asset make a simple class as  preset for a web restful data (text, file or text json) transferts... not else.
<br><br>

## 📑 How to:

### Requirements: 

- an endpoint for a restful api with text/json response ([read here](https://github.com/js-collection/xhr-perfect-model/blob/9fff6394fc89119693d347fd4bc3c5f50b7c4663/xhr-classic.js#L8C1-L15C4))
- suggested a good server walkie talkie system (like [comingsoon...]())
- in node / express you sure need to able [express.text({...})](https://expressjs.com/en/api.html#:~:text=express.text(%5Boptions%5D)) (if you buffering the trasmission) or [json+urlencoded](https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded) (not tested)


### Explain of codes:

<table>
<tr><td>class API</td><td width="9999">it's the container of all codes</td></tr>
<tr><td>configuration</td><td>it's the function for take the js configuration object and share it into the class</td></tr>
<tr><td>router</td><td>it's the function for loop the object in the configuration, it move into the api sector and it find the correct endpoint</td></tr>
<tr><td>transfer</td><td>it's the function, with all data, that make the xhr connection for your api's</td></tr>
<tr><td>transmitted</td><td>it's silent mode of transfer, return only the results when transfer has finished</td></tr>
<tr><td>log</td><td>it's a method for print a little ordered log of you api call</td></tr>
</table>

### Usage:

- Load class into you web page, like this:
  ```js
  <script src=".../xhr-linear.js"></script>
  //or xhr-async.js or rename it
  ```
  <br>

- Configuration of your api roots:<br><br>
  You can make a config inside the xhr-async|linear.js:
  ```js
  const api = new class API {
    // other of the class, yout don't need to touch it
  }

  api.configuration({

    baseroute: 'http://myapiurl:myport',    // it's you base api url
    debugger: 2,                            // from 0 (no logs) to 3 (full logs)

    sectors: [{                             // it's the lists of you sections of api type (v1,v2,CRUD,FILESYS, ecc)

      name: 'mySecotorSplitter',            // the nickname (a fake name for target it) of splitter (ex V1-GLOBAL, V1-CRUD, V1-FS, other)
      path: '/my/api/real/sector/path/',    // it's the real path (ex /v1/crud-operations/apis/)
      actions: [{
        endpoint: 'myRealEndpointFile',     // this is the endpoint (ex removeFile.js, or removedirectory.php)
        method: 'POST',                     // classic methods (POST|PUT|GET|PATCH|DELETE)
        mode: 'async'                       // async or everything, we like "linear" but its in anycase a sync
      },{
        endpoint: 'myOtherRealEndpointFileSync',
        method: 'POST',
        mode: 'linear'
      },/*your other api endpoints*/]

    },/*your other api sectors*/]

  })
  ```
  or, if you want, you can put the config outside and import it like this:

  ```js
  // into you xhr-config.js
  export {

    baseroute: 'http://myapiurl:myport',    // it's you base api url
    debugger: 2,                            // from 0 (no logs) to 3 (full logs)
    sectors: [
      // { all other sectors data... }
    ]

  }

  // into class file
  const api = new class API {
    // other of the class, yout don't need to touch it
  }

  import * as configuration from './xhr-config.js'
  api.configuration( configuration )
  ```
  <br>

- Make a form with you data or a function for you API, like:
  ```html
    <html>

      <form id="test">
          <!--THIS IS A STUPID MODEL, MAKE YOU A CUSTOM DATA-->
          <input multiple="false" name="collector" type="file">
          <input name="test" type="text" placeholder="write every you wont ;)">
          <button name="tester">TEST DATA</button>
      </form>

      <script>
        window.onload = () => {
          if (document.readyState == 'complete') {
    
            //test api and system
            function API_TEST() {
    
              let form = document.forms[ 'test' ],
                  formfiles = form['collector'],
                  testnow = form[ 'tester' ]
    
              testnow.onclick = () => {
                  //do operations and call api...
              }
    
          }
    
        }
      }
      </script>

    </html>
  ```
  <br>

- _XHR LINEAR (no async await):_ use asset to call the class for talk with your api walkie talkie like this:

  ```js
  // set call profile (it's a demo)

  const myCallProfile = { 
    sector: 'files',
    target: 'upload-file',
    params: {
      file  : formfiles.files[i],
      name  : form['name'].value||formfiles.files[i].name,
      // other : ...
    }
  }
  
  // api call model   

  api.transfer(
    myCallProfile,
    progress => console.log("in progress...", progress) ,
    results => console.log("data in back : ",results)
  )
  ```

  How you can easy see, after setted a target in profile and the correct params of your api endpoint, you have 2 callback:
  - progress return the object with progression data sended (an exemple, the bytes and percentage of file sending) and it is called for many times how steps needed for completation (or failing)
  - results is the final data resulted of operations... the payloads, the restful json object of end operations
   <br><br>

- _XHR ASYNC:_ in an async function or asset, use below codes to call the class for talk with your api walkie talkie like this:

  ```js
  // set endpoint target profile (it's a demo)

  const myCallProfile = { 
    sector: 'files',
    target: 'upload-file',
    params: {
      file  : formfiles.files[i],
      name  : form['name'].value||formfiles.files[i].name,
      // other : ...
    }
  }

  // style zero (no async ~ await is not required)
  // for this approach we raccommend the linear script type
  await api.transfer(
      myCallProfile,
      progress=> { console.log("progress:", progress) },
      result=> { console.log("results:", result) }
  )
  

  // api call style models : style one (partial sync)
  const results = await api.transfer( myCallProfile, progress => { console.log("progress:", progress) }).results()
  console.log("results:", results )
  
  
  // api call style models : style two (destructured partial async)
  const { results } = await api.transfer( myCallProfile, progress => { console.log("progress:", progress ) })
  console.log("results:", await results() )
  

  // api call style models : style three (full destructured async )
  const { progress, results } = api.transfer( myCallProfile )
  progress( progress => console.log("progress:", progress) )
  console.log("results:", await results() )
  
  
  // api call style models : style four (procedural async)
  const transit  = api.transfer( myCallProfile )
  const progress = transit.progress( values => console.log("progress:", values) )
  const results  = await transit.results()
  console.log("results:", results)
  

  // api call style models : shorted (transmitted wait direct result without progress):
  const results = await api.transmitted( myCallProfile )
  console.log("results:", results )
  ```

