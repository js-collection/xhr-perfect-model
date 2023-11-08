# xhr-perfect-model

**An asset model for make the smallest xhr walkie talkie client system.**<br>
<sub>This project is built by Alberto Marangelo (@berto-dev) [¹](https://berto.dev) [²](https://github.com/berto-dev) for Deveet Technologies [¹](https://deveet.com) [²](https://github.com/Deveet-Technologies)</sub><br>
<sup><sub><i>This is open code in MIT licence. If you use in your blog it's a good idea to include "taken from original GITPAGE of the AUTHORSLINK"</i></sub></sup>

---
## Model type:

This is the classic model. Someone don't like this because can encurred in a ["callback hell"](https://www.google.com/search?q=what%27s+callback+hell&oq=callback+hell+what&gs_lcrp=EgZjaHJvbWUqCAgBEAAYFhgeMgYIABBFGDkyCAgBEAAYFhge0gEIMzY3OGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8). If you are that type of dev we suggest the async styled model. In short, it both are the same model but this not need a promise and is stepped and understandable, the async needs of the  async/promise syntax and can be little bit complex respect of this classic version

---

## How to use:

- Load class into you web page, like this:
  ```js
  <script src=".../xhr-classic.js"></script>
  ```

- make a form with you data or a function for you API, like:
	```html
  <html>
    <form id="test">
        <!--THIS IS A STUPID MODEL, MAKE YOU A CUSTOM DATA-->
        <input multiple="false" name="collector" type="file">
        <input name="test" type="text" placeholder="write every you wont ;)">
        <button name="tester">TEST DATA</button>
    </form>
  </html>
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
	```

- use asset to call the class for api walkie talkie like this:

  ```js
  // set endpoint target profile (it's a demo)

  var profile = { 
      action :'demo-upload-file'
  }
  
  // set endpoint target required parameters

  var params  = {
      file  : formfiles.files[i],
      name  : form['name'].value||formfiles.files[i].name,
      // other : ...
    }
  
  // api call model   

  api.transfer(
    [profile,params],
    progress => console.log("in progress...", progress) ,
    results => console.log("data in back : ",results)
  )
  ```

  How you can easy see, after setted a target in profile and the correct params of your api endpoint, you have 2 callback:
  - progress return the object with progression data sended (an exemple, the bytes and percentage of file sending) and it is called for many times how steps needed for completation (or failing)
  - results is the final data resulted of operations... the payloads, the restful json object of end operations
 
  Remember to register your api into the class in place of the `connectors_ENDPOINT_SECTOR` placeholder. You can registre infinite api sectors.

