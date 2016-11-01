<img src="https://raw.githubusercontent.com/hypersasha/npm-webbox/master/example/css/imgs/wb_logo.png" width="320"/>

Webbox JavaScript module. See original webbox [here](https://github.com/hypersasha/npm-webbox).

### Version
Current version of jsWebBox is 0.0.2 (Alpha)

## Installing
You can add jsWebBox to your project, using \<script> tag in your \<head>:

```HTML
<head>
  <!--- jsWebbox /-->
  <script type="text/javascript" src="https://raw.githubusercontent.com/hypersasha/js-webbox/master/webbox-uncopressed.0.2.js"></script>
</head>
```
Or just download compressed or uncompressed version from this repository.

## Sending POST/GET-requests
Before sending POST/GET-request, you must specify request parameters, using a simple JavaScript object.  
Then you can send request with **xmlRequest(**_\<parameters>_, [callback]**)**.

###### Example:
```JavaScript
var params = {
  url: '/pingpong',
  method: 'POST',
  data: {
    msg: text
  }
};
XmlRequest(params, function(data){
  console.log(data);
});
```

##### Full parameters list
| Name | Type | Description |
| --- | --- | --- |
| url | String | A request URL. |
| method | String | Request method: POST/GET. |
| data | Object | **OPTIONAL.** Request data. |
| file | Object File List | **OPTIONAL**. Files you want to send. |
| success | Function | Request onSuccess listener. **Optional,** if callback function was specified in _XmlRequest()._ |
| progress | Function | **OPTIONAL.** Request onProgress listener. Callback function. Accepts 2 arguments: loaded bytes and total bytes to upload. |
| error | Function | **OPTIONAL.** Request onError listener. Can accept 2 arguments: status, text. |

## Using FilePicker
FilePicker can help you to make a simple input file form.  
Just look at example below.

###### Example:
```HTML
<!-- index.html /-->
<!DOCTYPE html>
<html>
<head>
  <title>Index</title>
  <script type="text/javascript" src="js/webbox-uncopressed.0.2.js"></script>
  <script type="text/javascript" src="js/common.js"></script>
</head>
<body>
  <div id="picTest">
    <h3>Sending Files.</h3>
    <button onclick="chooseFile()">Send</button>
  </div>
</body>
</html>
```
```JavaScript
// common.js
var fp = new filePicker(true); // true - allow multiple file choose
fp.onchange(uploadFile);

function chooseFile() {
  fp.pick();
}

function uploadFile(files) {
  if (!fp.isEmpty()) {
    var params = {
      url: '/uploadFile',
      method: 'POST',
      data: {msg: "Catch this file!"},
      file: files,
      success: onSuccess
    };
    XmlRequest(params);
  } else {
    console.error('File not found!');
  }
}

function onSuccess(data) {
  console.log(data);
}
```
