/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var currentUser;
var baseUrl = "http://192.168.0.3:81/RestServiceImpl.svc/";
var connectionErrorMessage = "Cannot connect to server!";
var barcodes;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //document.getElementById('page1_btnScan').addEventListener('click', scan, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function encode() {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function (success) {
        alert("encode success: " + success);
    }, function (fail) {
        alert("encoding failed: " + fail);
    }
    );

}

function login() {
    $.mobile.loading('show', { theme: "a", text: "Please wait...", textonly: false, textVisible: true });

    var username = $('#txtUsername').val();
    var password = $('#txtPassword').val();

    if (username == "" || password == "")
    {
        $('#page1MessageText').text("Username and/or password required!");
        $.mobile.changePage("#page1Message", { role: "dialog" });
        return false;
    }

    Url = baseUrl + "Login?username=" + username + "&password=" + password;

    $.ajax({
        type: "GET",
        url: Url,
        success: function (msg) {
			currentUser = username;
			$("#controlList").append('<li><a href="#" id="ctrF1">Function 1</a></li>');
			$("#ctrF1").click(function () {
				$.mobile.changePage("#pageF1", { transition: "slide" });
			});
			/*
            if (msg != "") {
                currentUser = username;
                $.mobile.changePage("#controlPage", { transition: "slide" });
                $("#controlList").html("");
                if (msg.HasAccessToFn1) {
                    $("#controlList").append('<li><a href="#" id="ctrF1">Function 1</a></li>');
                    $("#ctrF1").click(function () {
                        $.mobile.changePage("#pageF1", { transition: "slide" });
                    });
                }

                if (msg.HasAccessToFn2) {
                    $("#controlList").append('<li><a href="#" id="ctrF2">Function 2</a></li>');
                    $("#ctrF2").click(function () {
                        $.mobile.changePage("#pageF2", { transition: "slide" });
                    });
                }

                if (msg.HasAccessToFn3) {
                    $("#controlList").append('<li><a href="#" id="ctrF3">Function 3</a></li>');
                    $("#ctrF3").click(function () {
                        $('#pageF3').on('pageshow', function () {
                            page3_getcodes();
                        });
                        $.mobile.changePage("#pageF3", { transition: "slide" });
                    });
                }

                if (msg.HasAccessToFn4) {
                    $("#controlList").append('<li><a href="#" id="ctrF4">Function 4</a></li>');
                    $("#ctrF4").click(function () {
                        $.mobile.changePage("#pageF4", { transition: "slide" });
                    });
                }

                if (msg.HasAccessToFn5) {
                    $("#controlList").append('<li><a href="#" id="ctrF5">Function 1</a></li>');
                }

                if (msg.HasAccessToFn6) {
                    $("#controlList").append('<li><a href="#" id="ctrF6">Function 1</a></li>');
                }

                if (msg.HasAccessToFn7) {
                    $("#controlList").append('<li><a href="#" id="ctrF7">Function 1</a></li>');
                }

                if (msg.HasAccessToFn8) {
                    $("#controlList").append('<li><a href="#" id="ctrF8">Function 1</a></li>');
                }

                $('#controlList').listview('refresh');
            }
            else {
                $.mobile.changePage("#loginError", { role: "dialog" });
            }
			*/
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //$.mobile.changePage("#connectionError", { role: "dialog" });
			currentUser = username;
			$("#controlList").append('<li><a href="#" id="ctrF1">Function 1</a></li>');
			$("#ctrF1").click(function () {
				$.mobile.changePage("#pageF1", { transition: "slide" });
			});
        }
    });
    $.mobile.loading('hide');//, { theme: "a", text: "Please wait...", textonly: false, textVisible: true });

}

function page1_scan() {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    scanner.scan(function (result) {
        if (result.format == "QR_CODE" || result.format == "DATA_MATRIX" || result.format == "PDF417" || result.format == "RSS_EXPANDED")
        {
            $.mobile.changePage("#scanError", { role: "dialog" });
        }
        else
        {
            document.getElementById('page1_txtBarcode').value = result.text;
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
        }
    }, function (error) {
        $.mobile.changePage("#scanError", { role: "dialog" });
    });
}

function page1_barcodeValidate() {
    var code = $('#page1_txtBarcode').val();

    if (code == "") {
        $('#page1MessageText').text("Barcode field is required!");
        $.mobile.changePage("#page1Message", { role: "dialog" });
        return false;
    }
    
    
    Url = baseUrl + "ValidateCode?code=" + code;

    $.ajax({
        type: "GET",
        url: Url,
        success: function (msg) {
            if(msg)
            {
                $('#page1_txtCode').val(code);
                $('#page1_txtBarcode').val("");
                $('#page1MessageText').text("Barcode validated.");
                $.mobile.changePage("#page1Message", { role: "dialog" });
                $('#page1_btnSave').attr("disabled", false);
            }
            else
            {
                $('#page1MessageText').text("Barcode exists!");
                $.mobile.changePage("#page1Message", { role: "dialog" });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.changePage("#connectionError", { role: "dialog" });
        }
    });
}

function page1_barcodeSave() {
    var code = $('#page1_txtCode').val();
    var email = $('#page1_txtEmail').val();
    var username = currentUser;

    if (email == "") {
        $('#page1MessageText').text("Email field is required!");
        $.mobile.changePage("#page1Message", { role: "dialog" });
        return false;
    }

    if (code == "") {
        $('#page1MessageText').text("Barcode field is required!");
        $.mobile.changePage("#page1Message", { role: "dialog" });
        return false;
    }

    Url = baseUrl + "SaveCode?code=" + code + "&email=" + email + "&username=" + username;

    $.ajax({
        type: "GET",
        url: Url,
        success: function (msg) {
            if (msg) {
                $('#page1MessageText').text("Barcode saved.");
                $.mobile.changePage("#page1Message", { role: "dialog" });

                $('#page1_txtEmail').val("");
                $('#page1_txtCode').val("");
            }
            else {
                $('#page1MessageText').text("Failed to save barcode.");
                $.mobile.changePage("#page1Message", { role: "dialog" });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.changePage("#connectionError", { role: "dialog" });
        }
    });
}

function page2_scan() {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    scanner.scan(function (result) {
        if (result.format == "QR_CODE" || result.format == "DATA_MATRIX" || result.format == "PDF417" || result.format == "RSS_EXPANDED") {
            $.mobile.changePage("#scanError", { role: "dialog" });
        }
        else {
            document.getElementById('page2_txtBarcode').value = result.text;
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
        }
    }, function (error) {
        $.mobile.changePage("#scanError", { role: "dialog" });
    });
}

function page2_barcodeRetrieve()
{
    var code = $('#page2_txtBarcode').val();

    if (code == "") {
        $('#page1MessageText').text("Barcode field is required!");
        $.mobile.changePage("#page1Message", { role: "dialog" });
        return false;
    }


    Url = baseUrl + "GetCode?code=" + code;

    $.ajax({
        type: "GET",
        url: Url,
        success: function (msg) {
            if (msg != "") {
                $('#page2_txtCode').val(code);
                $('#page2_txtBarcode').val("");
                $('#page2_txtEmail').val(msg.email);
                $('#page1MessageText').text("Barcode retrieved.");
                $.mobile.changePage("#page1Message", { role: "dialog" });
                $('#page1_btnSave').attr("disabled", false);
            }
            else {
                $('#page1MessageText').text("Barcode does not exist!");
                $.mobile.changePage("#page1Message", { role: "dialog" });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.changePage("#connectionError", { role: "dialog" });
        }
    });
}

function page1_barcodeUpdate()
{
    var code = $('#page2_txtCode').val();
    var email = $('#page2_txtEmail').val();
    var username = currentUser;

    if (email == "") {
        $('#page1MessageText').text("Email field is required!");
        $.mobile.changePage("#page1Message", { role: "dialog" });
        return false;
    }

    if (code == "") {
        $('#page1MessageText').text("Barcode field is required!");
        $.mobile.changePage("#page1Message", { role: "dialog" });
        return false;
    }

    Url = baseUrl + "UpdateCode?code=" + code + "&email=" + email + "&username=" + username;

    $.ajax({
        type: "GET",
        url: Url,
        success: function (msg) {
            if (msg) {
                $('#page1MessageText').text("Barcode saved.");
                $.mobile.changePage("#page1Message", { role: "dialog" });

                $('#page2_txtEmail').val("");
                $('#page2_txtCode').val("");
            }
            else {
                $('#page1MessageText').text("Failed to update barcode.");
                $.mobile.changePage("#page1Message", { role: "dialog" });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.changePage("#connectionError", { role: "dialog" });
        }
    });
}

function page3_getcodes() {
    Url = baseUrl + "GetAllBarcodes";

    $.ajax({
        type: "GET",
        url: Url,
        success: function (msg) {
            $('#barcodeList').html("");
            for(var i=0;i<msg.length;i++)
            {
                $("#barcodeList").append('<li><a href="#" id="barcode_' + msg[i].Id + '" onclick="getDetails(\'' + msg[i].barcode1 + '\')">' + msg[i].barcode1 + '</a></li>');
            }
            $('#barcodeList').listview('refresh');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.changePage("#connectionError", { role: "dialog" });
        }
    });
}

function getDetails(barcode)
{
    Url = baseUrl + "GetCode?code=" + barcode;

    $.ajax({
        type: "GET",
        url: Url,
        success: function (msg) {
            if (msg != "") {
                $('#barcodeDetails_txtCode').val(msg.barcode1);
                $('#barcodeDetails_txtEmail').val(msg.email);
                
                var dt = new Date(parseInt(msg.barcode_date.replace('/Date(', '')));
                $('#barcodeDetails_txtDate').val(dt.toDateString());
                $('#barcodeDetails_txtUser').val(msg.username);
                
                $.mobile.changePage("#barcodeDetails", { transition: "slide" });
            }
            else {
                $('#page1MessageText').text("Barcode does not exist!");
                $.mobile.changePage("#page1Message", { role: "dialog" });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.changePage("#connectionError", { role: "dialog" });
        }
    });   
}

function confirmDeleteBarcode()
{
    $('#confirmDelete_text').html("Are you sure you want to delete barcode value " + $('#barcodeDetails_txtCode').val());
    $.mobile.changePage("#confirmDelete", { role: "dialog" });
}

function deleteBarcode() {
    Url = baseUrl + "DeleteCode?code=" + $('#barcodeDetails_txtCode').val();
    $.ajax({
        type: "GET",
        url: Url,
        success: function (msg) {
            if (msg) {
                //do Nothing
                $.mobile.changePage("#barcodeDeleted", { role: "dialog" });
            }
            else {
                $.mobile.changePage("#barcodeDeletedError", { role: "dialog" });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.changePage("#connectionError", { role: "dialog" });
        }
    });
}


