var url = 'wss://YOUR WEBSOCKET URL HERE eg. 0123456789.execute-api.us-west-2.amazonaws.com/staging/'

// References
/*
1/ timlinr - https://github.com/juanbrujo/jQuery-Timelinr
2/ toastr - https://github.com/CodeSeven/toastr
3/ jQuery - https://jquery.com/
4/ w3schools - 
https://www.w3schools.com/js/
https://www.w3schools.com/jquery/
5/ react - https://reactjs.org/docs/hello-world.html
6/ aws-samples -
https://github.com/aws-samples/websocket-api-cognito-auth-sample
https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/python/cross_service/apigateway_websocket_chat
https://github.com/aws-samples/simple-websockets-chat-app
*/

import './toastr.min.js';
import './jquery.timelinr-0.9.7v2.js'

$(document).ready(function(){
  var options = {
      orientation:              'horizontal', // value: horizontal | vertical, default to horizontal
      containerDiv:             '#timeline',  // value: any HTML tag or #id, default to #timeline
      datesDiv:                 '#dates',     // value: any HTML tag or #id, default to #dates
      datesSelectedClass:       'selected',   // value: any class, default to selected
      datesSpeed:               'normal',     // value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to normal
      issuesDiv:                '#issues',    // value: any HTML tag or #id, default to #issues
      issuesSelectedClass:      'selected',   // value: any class, default to selected
      issuesSpeed:              1000,       // value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to fast
      issuesTransparency:       0.0,          // value: integer between 0 and 1 (recommended), default to 0.2
      issuesTransparencySpeed:  1000,          // value: integer between 100 and 1000 (recommended), default to 500 (normal)
      prevButton:               '#prev',      // value: any HTML tag or #id, default to #prev
      nextButton:               '#next',      // value: any HTML tag or #id, default to #next
      arrowKeys:                'true',      // value: true | false, default to false
      startAt:                  1,            // value: integer, default to 1 (first)
      autoPlay:                 'false',      // value: true | false, default to false
      autoPlayDirection:        'forward',    // value: forward | backward, default to forward
      autoPlayPause:            2000          // value: integer (1000 = 1 seg), default to 2000 (2segs)
    }
  $('#timeline').timelinr(options)
}); 

$(document).on('load','#issues li', function() {
     //timeline(options);
});

$( window ).resize(function() {
});

function toast(type, message=""){
  toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-bottom-left",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "2000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  
  if (type == "success"){
  toastr.success(message);
  }
  else if (type == "error"){
  toastr.error(message)
  }
  else if (type == "warning"){
  toastr.warning(message)
  }
  else if (type == "info"){
  toastr.info(message)
  }
  else if (type == "howTo"){
  
  toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": true,
      "progressBar": true,
      "positionClass": "toast-bottom-left",
      "preventDuplicates": true,
      "preventOpenDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "0",
      "extendedTimeOut": "0",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  
  //You will need to escape the next line with '\'
  var instructions = "\
  </br>----</br>\
  How to use the Workshop Sample UI</br>----</br></br>\
  1/ Find a Latitude and Longitude value</br></br>\
  2/ Get a time frame that you would like to see changes in forestry</br></br>\
  3/ Submit the data</br></br>\
  4/ Ensure you keep the same data values you entered before you query</br></br>\
  5/ Query the data</br></br>\
  6/ You can use your keyboard arrow keys and mouse clicks to look through map tiles</br></br>\
  */ The center of the loading circle is clickable to make it disappear ;)\
  "

  toastr.info(instructions, "Welcome to SUS201!");
  
  }
  else if (type == "clear"){
    toastr.clear()
  }

  else if (type == "samples"){

  //You will need to escape the next line with '\'
  var samples = "\
  1/ Paradise, California, USA </br>\
  Lat: 39.45  </br>\
  Long: -121.75 </br>\
  TimeStart: 2021-01-01 </br>\
  TimeEnd: 2022-06-01 </br>\
  <button type=\"button\" class=\"btn clear\">Use this Sample</button>\
  </br>\
  "

    toastr.info(samples,
    "Sample Locations and Times",
    {
    "closeButton": true,
    "progressBar": true,
    "timeOut": 0,
    "extendedTimeOut": 0,
    "preventDuplicates": true,
    "preventOpenDuplicates": true,
    "timeOut": "0",
    "extendedTimeOut": "0",
    "positionClass" : "toast-bottom-left",
    "tapToDismiss": true,
    "onclick" : function() {sampledata(1);}
    });
  //You will need to escape the next line with '\'
  var samples = "\
  2/ Atlantic Rainforest - Brazil </br>\
  Lat: -16.50  </br>\
  Long: -39.25 </br>\
  TimeStart: 2017-08-01 </br>\
  TimeEnd: 2018-03-31 </br>\
  <button type=\"button\" class=\"btn clear\">Use this Sample</button>\
  </br>\
  "
    toastr.info(samples,
    "Sample Locations and Times",
    {
    "closeButton": true,
    "progressBar": true,
    "timeOut": 0,
    "extendedTimeOut": 0,
    "preventDuplicates": true,
    "preventOpenDuplicates": true,
    "timeOut": "0",
    "extendedTimeOut": "0",
    "positionClass" : "toast-bottom-left",
    "tapToDismiss": true,
    "onclick" : function() {sampledata(2);}
    });
  }
}//end function

function timeLine(options){
  //$('#timeline').timelinr(options)
}

function connect(url) {
  var ws = new WebSocket(url); 

  ws.onopen = function(event) {
    console.log("socket open")
    console.log(event)
    /*ws.send(JSON.stringify({
        action: 'sendmessage'
    }));*/

    toast("success", "Connected to Websocket");
    toast("howTo");
    
  };

  ws.onmessage = function(event) {
    console.log(event)
    if (event.data !== ""){
        toast("success", "Data Recieved")

        console.log('Recieved data:', event.data);
        console.log('Full message from server', event)
        try{
            const cleanString = str => str.split('"')[1].replace(/'/g, '"');
            var parsed_data = JSON.parse(cleanString(event.data))
            if(parsed_data['tiles'].length == 0){
              console.log("0 tiles found")
              setTimeout(function (){
                  toast("info", "No map tiles found for queried dataset")
              }, 2000);//Wait 2 seconds          
            }else{
              console.log(parsed_data)
              console.log(parsed_data[0])
              console.log(parsed_data['tiles'])
              parseJSONpayload(parsed_data['tiles']);
              setTimeout(function (){
                //reload timeline to take note of new DOM elements
                var options = {
                    arrowKeys:                'true',      // value: true | false, default to false
                    startAt:                  1,            // value: integer, default to 1 (first)
                    autoPlay:                 'false',      // value: true | false, default to false
                    autoPlayDirection:        'forward',    // value: forward | backward, default to forward
                    autoPlayPause:            2000          // value: integer (1000 = 1 seg), default to 2000 (2segs)
                  }
                $('#timeline').timelinr(options)
              }, 2000);//Wait 2 seconds
            }
        }catch(e){
          console.log("Error Data")
          console.log(e)
          toast("error", "Something wrong with Data Payload")
        }
    }
    else{
      toast("success", "Successful websocket send-recieve")
    }
    setTimeout(function (){
      document.getElementById("loaderDiv").classList.add("hideLoader");
    }, 3000);//Wait 3 seconds
  };

  ws.onclose = function(event) {
    console.log('Socket is closed. Reconnect will be attempted in 5 second.', event.reason);
    toastr.remove();
    toast("warning", "WebSocket connection Closed")

    setTimeout(function() {
      connect(url);
    }, 5000);
  };

  ws.onerror = function(error) {
    toast("error", "WebSocket encountered an Error")

    console.error('Socket encountered error: ', error.message, 'Closing socket');
    console.log(error)
    ws.close();
  };

/*BUTTON CLICK EVENTS*/
document.getElementById("submitbtn").addEventListener("click", function () {
  var parsed_form = parseFormToJSON(document.getElementById("coordinatesform"));
  var websocket_payload = generateWebsocketPayload("sendData", parsed_form)
  console.log("sending data")

  document.getElementById("loaderDiv").classList.remove("hideLoader");
  if (ws.readyState !== WebSocket.CLOSED) {

   console.log("Socket Open; Ok to send message")
   ws.send(websocket_payload);

  toast("success", "Sending Data for Processing")
  }
  else{
    console.log("Socket Closed; Attempting to reopen socket to send message")
    connect(url);
    ws.send(websocket_payload); 
  }   
  
});

document.getElementById("clearbtn").addEventListener("click", function () {
  console.log("clearning form")
  document.getElementById("coordinatesform").reset();
});

document.getElementById("querybtn").addEventListener("click", function () {

  //clear the timeline so that the timelinr plugin loads properly
  timelineClearer()
  timelineBuilder()

  console.log("query data from socket endpoint")
  var parsed_form = parseFormToJSON(document.getElementById("coordinatesform"));
  var websocket_payload = generateWebsocketPayload("queryData", parsed_form)
  console.log("sending data")
  document.getElementById("loaderDiv").classList.remove("hideLoader");
  if (ws.readyState !== WebSocket.CLOSED) {
   console.log("Socket Open; Ok to send message")
   ws.send(websocket_payload);

   toast("success", "Querying Data")
  }
  else{
    console.log("Socket Closed; Attempting to reopen socket to send message")
    connect(url);
    ws.send(websocket_payload); 
  }
});

document.getElementById("howtobtn").addEventListener("click", function () {
  toast("howTo");
});

document.getElementById("samplesbtn").addEventListener("click", function () {
  toast("clear");
  toast("samples");
}); 

document.getElementById("loader").addEventListener("click", function () {
  document.getElementById("loaderDiv").classList.add("hideLoader");
});

}
connect(url);


function sampledata(sampleselect){
    var lat = "";
    var lon = "";
    var datestart = "";
    var dateend = "";
  
    switch(sampleselect) {
    case 1:
      lat = "39.45";
      lon = "-121.75";
      datestart = "2017-01-01";
      dateend = "2022-06-01";
      break;
    case 2:
      lat = "99.45";
      lon = "-34.75";
      datestart = "2015-01-01";
      dateend = "2022-06-01";
      break;
    default:
      // code block
  }
  document.getElementById("coordinatesform").reset();
  document.getElementById("data-lat").setRangeText(lat);
  document.getElementById("data-lon").setRangeText(lon);
  document.getElementById("data-datestart").setRangeText(datestart);
  document.getElementById("data-dateend").setRangeText(dateend);
  toast("clear");
  setTimeout(function (){
    toastr.remove();
  }, 1000);//Wait 1 second

}

function generateWebsocketPayload(websocket_action_path, parsed_form){
  var json = {}  
  json['action'] = websocket_action_path  
  json['body'] = {}
  json['body']['data']= generateJSONpayload(parsed_form);
  console.log("complete json_payload")
  var json_string = JSON.stringify(json)
  console.log(json_string)

  return json_string
}

function parseFormToJSON(form){
  console.log("converting form data to json")
  const data = new FormData(form);
  console.log(data)
  var object = {};
  data.forEach(function(value, key){
      object[key] = value;
  });
  return object;    
}

function generateJSONpayload(form_object){
      console.log("creating json payload")
      //Sample Expected Payload {"a": "-121.64","b": "39.68","c": "-121.68","d": "39.72","startDate": "2018-11-01T00:00:00","endDate": "2019-11-01T23:59:59"}
      // a, c = Longitude(min,max); b, d = Latitude(min,max)
      // form_object contains
      // {"latitude":"a","longitude":"","startDate":"","endDate":""}
      console.log(form_object)
      var object = {}
      
      var a = parseFloat(form_object["longitude"])-0.02
      var b = parseFloat(form_object["latitude"])-0.02
      var c = parseFloat(form_object["longitude"])+0.02
      var d = parseFloat(form_object["latitude"])+0.02

      object["a"] = a.toFixed(2)
      object["b"] = b.toFixed(2)
      object["c"] = c.toFixed(2)
      object["d"] = d.toFixed(2)
      
      var datetime_start = new Date(form_object["startDate"]);
      var datetime_end = new Date(form_object["endDate"]);
      datetime_start = datetime_start.toISOString().replace('Z', '');
      //datetime_end = datetime_end.toISOString().replace('Z', '').replace('T', '');
      datetime_end = datetime_end.toISOString().replace('Z', '');

      object["startDate"] = datetime_start
      object["endDate"] = datetime_end

      console.log(object)
      return object;
}

function parseJSONpayload(jsonPayload={}){
    if(jsonPayload.length==0){
        console.log("Expecting jsonPayload to be a JSON array")
    }
    else{

        /* iterate through json array */
        for (var i = 0; i < jsonPayload.length; i++){
          //console.log("array index: " + i);
          var obj = jsonPayload[i];

          jsonUIbuilder2(obj);

          for (var key in obj){
            var value = obj[key];
            console.log(key + ": " + value);
          }
          //console.log(obj.date);
        }
    }
}


function jsonUIbuilder(jsonPayload={}){

    var div = document.createElement("div");
    div.setAttribute('class', 'mySlides fade');
    
    var img = document.createElement("img");
    img.setAttribute('class', 'imgDisplay');
    img.src = jsonPayload.url;
    div.appendChild(img);
    
    var textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'text');
    textDiv.innerHTML = jsonPayload.date
    div.appendChild(textDiv);
    
    /*var textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'text');
    textDiv.innerHTML = jsonPayload.titleId
    div.appendChild(textDiv);*/
    
    document.getElementById("slideshow-container").appendChild(div);
    
    /*dots*/
    var span = document.createElement("span")
    span.setAttribute('class', "dot");
    document.getElementById("slideshow-dots").appendChild(span);

}

function jsonUIbuilder2(jsonPayload={}){
/*
      <ul id="dates">
      <li><a href="#2022-7-03">2022-7-03</a></li>
      <li><a href="#2022-7-04">2022-7-04</a></li>
      <li><a href="#2022-7-05">2022-7-05</a></li>
    </ul>
    <ul id="issues">
      <li id="2022-7-03">
        <img src="https://roda.sentinel-hub.com/sentinel-s2-l1c/tiles/10/S/FJ/2020/6/3/0/preview.jpg" width="450" height="450" />
      </li>
*/
/*Steps:
1/Create li for #dates FORMAT: <li><a href="#2022-7-03">2022-7-03</a></li>
2/Create li for #issues FORMAT: 
      <li id="2022-7-03">
        <img src="https://roda.sentinel-hub.com/sentinel-s2-l1c/tiles/10/S/FJ/2020/6/3/0/preview.jpg" width="450" height="450" />
      </li>
*/
var li_dates = document.createElement("li");
var a_dates = document.createElement("a");
a_dates.setAttribute('href', '#'+jsonPayload.date);
a_dates.innerHTML = jsonPayload.date
li_dates.appendChild(a_dates);
//document.getElementById("dates").appendChild(li_dates);
$('#dates').append(li_dates);

var li_issues = document.createElement("li");
li_issues.id = jsonPayload.date;
var img_issues = document.createElement("img");
img_issues.setAttribute('src', jsonPayload.url);
img_issues.setAttribute('class', 'tileDisplay');
li_issues.appendChild(img_issues);
var legend_issues = document.createElement("img");
legend_issues.setAttribute('src', 'legend.png');
legend_issues.setAttribute('class', 'legendDisplay');
li_issues.appendChild(legend_issues)
//document.getElementById("issues").appendChild(li_issues);
$('#issues').append(li_issues);
}

function timelineClearer(){
  /* clear existing elements */
  /*var slideshowNode = document.getElementById("slideshow-container");
  var dotsNode = document.getElementById("slideshow-dots");
  slideshowNode.innerHTML = '';
  dotsNode.innerHTML = '';*/
  $('#timeline').unbind().removeData();
  $('#dates').remove(); //remove deletes this node and the children
  $('#issues').remove();//empty removes everything inside
  $('#timeline').remove();

}

function timelineBuilder(){
  var timeline_div = document.createElement("div")
  var ul_issues = document.createElement("ul");
  var ul_dates = document.createElement("ul");
  var div_left = document.createElement("div")
  var div_right = document.createElement("div")
  var a_next = document.createElement("a")
  var a_prev = document.createElement("a")
  ul_issues.id = 'issues';
  ul_dates.id = 'dates';
  timeline_div.id = 'timeline'
  div_left.id = 'grad_left'
  div_right.id = 'grad_right'
  a_next.id = 'next'
  a_prev.id = 'prev'
  a_next.setAttribute('href', '#');
  a_prev.setAttribute('href', '#');

  $('#imgDiv').append(timeline_div);
  $('#timeline').append(ul_dates);
  $('#timeline').append(ul_issues);
  $('#timeline').append(div_left);
  $('#timeline').append(div_right);
  $('#timeline').append(a_next);
  $('#timeline').append(a_prev);
  

}
