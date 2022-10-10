var url = 'wss://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/staging/';


function connect(url) {
  var ws = new WebSocket(url);
  ws.onopen = function(event) {
    console.log("socket open")
    console.log(event)
    /*ws.send(JSON.stringify({
        action: 'sendmessage'
    }));*/
  };

  ws.onmessage = function(event) {
    if (event.data !== ""){
        console.log('Recieved data:', event.data);
        console.log('Full message from server', event)
        const cleanString = str => str.split('"')[1].replace(/'/g, '"');
        var parsed_data = JSON.parse(cleanString(event.data))
        console.log(parsed_data)
        console.log(parsed_data[0])
        console.log(parsed_data['tiles'])
        parseJSONpayload(parsed_data['tiles']);
    }
    document.getElementById("loaderDiv").classList.add("hideLoader");
  };

  ws.onclose = function(event) {
    console.log('Socket is closed. Reconnect will be attempted in 5 second.', event.reason);
    setTimeout(function() {
      connect(url);
    }, 5000);
  };

  ws.onerror = function(error) {
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
  console.log("query data from socket endpoint")
  var parsed_form = parseFormToJSON(document.getElementById("coordinatesform"));
  var websocket_payload = generateWebsocketPayload("queryData", parsed_form)
  console.log("sending data")
  document.getElementById("loaderDiv").classList.remove("hideLoader");
  if (ws.readyState !== WebSocket.CLOSED) {
   console.log("Socket Open; Ok to send message")
   ws.send(websocket_payload);
  }
  else{
    console.log("Socket Closed; Attempting to reopen socket to send message")
    connect(url);
    ws.send(websocket_payload); 
  } 
});

document.getElementById("loader").addEventListener("click", function () {
  document.getElementById("loaderDiv").classList.add("hideLoader");
});

}
connect(url);

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

        /* clear existing elements */
        var slideshowNode = document.getElementById("slideshow-container");
        var dotsNode = document.getElementById("slideshow-dots");
        slideshowNode.innerHTML = '';
        dotsNode.innerHTML = '';
        /* iterate through json array */
        for (var i = 0; i < jsonPayload.length; i++){
          //console.log("array index: " + i);
          var obj = jsonPayload[i];

          jsonUIbuilder(obj);

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
    
    var textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'text');
    textDiv.innerHTML = jsonPayload.titleId
    div.appendChild(textDiv);
    
    document.getElementById("slideshow-container").appendChild(div);
    
    /*dots*/
    var span = document.createElement("span")
    span.setAttribute('class', "dot");
    document.getElementById("slideshow-dots").appendChild(span);

}

