/**
 * WEBBOX-AJAX. V0.0.3
 */
var delTimer = null;
var paramsInfo = {
    url: {
        type: "string",
        ifundef: function() { throw new Error("Can't find a 'url' parameter."); }
    },
    method: {
        type: "string",
        ifundef: function() { throw new Error("Can't find a 'method' parameter."); }
    },
    data: {
        type: "object",
        ifundef: null
    },
    file: {
        type: "object",
        ifundef: null
    },
    success: {
        type: "function"
    },
    error: {
        type: "function"
    }
};

var requestTypes = {
    json: "application/json;charset=UTF-8",
    file: "multipart/form-data"
}

/**
 * Sends request to the server with Data-object.
 * @param params object with parameters such as: url(string), method(string), data(object), success(callback-function).
 * @param callback(optional): callback-function.
 */

function XmlRequest(params, callback) {

    if (params === undefined || typeof params != "object") {
        console.error("Can't find a 'params' argument.");
        return;
    }

    // Check All parametrs from params
    for (var paramInf in paramsInfo) {
        try {
            if (params[paramInf] === undefined) {
                if (paramsInfo[paramInf].ifundef !== undefined) {
                    if (typeof paramsInfo[paramInf].ifundef == "function") {
                        paramsInfo[paramInf].ifundef();
                    } else {
                        params[paramInf] = paramsInfo[paramInf].ifundef;
                    }
                }
            } else if (typeof params[paramInf] != paramsInfo[paramInf].type) {
                throw new Error("Wrong parameter '" + paramInf + "'. <" + paramsInfo[paramInf].type + "> expected, but <" +
                    typeof params[paramInf] + "> was given.");
            }
        } catch (err) {
            console.error(err);
            return;
        }
    }

    // Check Callback-function
    try {
        if (callback === undefined && params.success === undefined) {
            throw new Error("Cannot find a callback function for sendRequestWithJSON().");
        } else if (typeof callback != "function"  && params.success === undefined) {
            throw new Error("Wrong argument 'callback'. Function expected, but " + typeof callback + " was given.");
        } else if (callback !== undefined) {
            params.success = callback;
        }
    } catch (err) {
        console.error(err);
        return;
    }

    // Make JSON
    if (params.data != null) {
        params.data["url"] = window.location.href;
    } else {
        params.data = {url: window.location.href};
    }
    params.data = JSON.stringify(params.data);

    var xhr = new XMLHttpRequest();

    // If we have callback for progress -> Send event to it
    xhr.upload.onprogress = function(event) {
        if (params.progress !== undefined && typeof params.progress == "function") {
            params.progress(event.loaded, event.total);
        }
    };

    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
            return;
        }
        if (xhr.status !== 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
            if (params.error !== undefined) {
                params.error(xhr.status, xhr.statusText);
            }
        } else {
            var result_object = {
                status: xhr.status,
                response: JSON.parse(xhr.responseText)
            };
            // console.log(result_object);
            params.success(result_object);
        }
    };

    xhr.open(params.method, params.url, true);
    var type = "json";
    if (params.file !== undefined && params.file != null) {
        if (typeof params.file == "object") {
            type = "file";
            requestTypes[type] = params.file.type;
        }
    }
    if (type == "json") { 
        xhr.setRequestHeader("Content-Type", requestTypes[type]);
        xhr.send(params.data);
    }
    else { // send multipart/form-data
        var formData = new FormData();

        // check if some data is specified
        if (params.data != null){
            formData.append("wbFields", params.data);
        }

        // check files
        try {
            if (params.file[0].size <= 0 || params.file[0].size === undefined)
                throw new Error("Bad file given!");
        } catch (e) {
            console.error(e.stack);
            return;
        }
        for (var i = 0; i < params.file.length; i++) {
            formData.append("wbfile_" + i, params.file[i]);
        }

        // Send request
        xhr.send(formData);
    }
}

/**
 * Class which creates a hidden file input on your web-page.
 * @param  {Boolean} multiple: if true -> multi-select will be activated. Default: false
 */
function filePicker (multiple) {
    this.picker = document.createElement('input');
    var picker = this.picker;
    picker.type = "file";
    picker.multiple = multiple || false;
    picker.name = "wbPicker_"+Math.random()*1000000;
    picker.style.position = "fixed";
    picker.style.top = 0;
    picker.style.marginTop = "-40px";
    picker.style.opacity = "0";
    document.body.appendChild(picker);
}

/**
 * Opens a window with the file selection.
 */
filePicker.prototype.pick = function() {
    this.picker.click();
};

/**
 * Sets Your personal onchange function.
 * @param  {Function} callback: Your callback can accept an array of selected files.
 */
filePicker.prototype.onchange = function(callback) {
    var picker = this.picker;
    if (callback !== undefined && typeof callback === "function")
        picker.onchange = function(){ callback(picker.files); };
};

/**
 * Checks if filePicker is empty.
 * @return {Boolean} if empty, it returns <true>, else <false>
 */
filePicker.prototype.isEmpty = function() {
    return (this.picker.files[0] ? false : true);
};

/**
 * Returns an array of selected files.
 * @return {[Object]} Array of selected files.
 */
filePicker.prototype.getFiles = function() {
    return this.picker.files;
};

/**
 * Remove filePicker input from Your web-page.
 */
filePicker.prototype.remove = function() {
    document.body.removeChild(this.picker);
};