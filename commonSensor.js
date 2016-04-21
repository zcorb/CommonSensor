// The raw input from a designated sensor
var mainSensorData = 0;//prompt("");
var zone2SensorData = 0;
var motorData = 0;

// Threat level based on sensor data
var threatLvl = 0; // Possible int [0-3]
var prevThreatLvl = 0;

// Main page display elements
var mainRoom = document.querySelector(".main-room");
var zone2Display = document.querySelector(".zone2");
var motorDisplay = document.querySelector("#motor-state");

var mainInstruct = document.querySelector(".main-instruct");
var mainSensor = document.querySelector("#main-sensor");
var alertImgs = document.querySelectorAll(".main-img");
var zoneImgs = document.querySelector(".main-zone-actions").getElementsByTagName("img");
var sensor2 = document.querySelector(".sensor2-data");

console.log("You entered: " + mainSensorData);
changeSensorDisplay(mainSensorData);

var changeRoom = 0;
var sensorRunning = false;
var changeSensor = document.querySelector("#change-sensor");

var monitorRoom = document.querySelector("#monitor-room");

monitorRoom.addEventListener("click",function(){
	if(!sensorRunning){
		changeRoom = setInterval(function(){
			var myVariable = loadDoc("logs/Sensor1.txt");
			console.log(myVariable);
		
		
			// Get sensor and motor information
			loadDoc("logs/Sensor1.txt", mainSensor); //Math.random()*3.5;
			loadDoc("logs/Sensor2.txt", sensor2); //Math.random()*3.5;
			
			mainSensorData = Number(mainSensor.textContent);
			
			
			console.log("mainSensorData: "+mainSensorData);
			zone2SensorData = Number(sensor2.textContent); // Math.random()*3.5;
			motorData = String(loadDoc("logs/motor.txt")); // (Math.random()) < 0.5 ? "On" : "Off";

			// Display information
			//changeSensorDisplay(mainSensorData);
			changeZone2Display(zone2SensorData);
			threatLvl = assessThreat(mainSensorData);
			if (prevThreatLvl != threatLvl){ changeMainDisplay(threatLvl); }
			console.log("threatLvl: " + threatLvl + "prevThreatLvl: "+prevThreatLvl);
			prevThreatLvl = threatLvl;
			sensorRunning = true;
		}, 1000);
	}
});

changeSensor.addEventListener("click", function(){
	clearInterval(changeRoom);
	sensorRunning = false;
});


// Translate sensor into threat alert
function assessThreat(sensorData){
	if(isNaN(sensorData)) {return 2}
	if(sensorData > 0 && sensorData <= 1){
		return 0;

	} else if(sensorData > 1 && sensorData <= 2){
		return 1;

	} else {// if(sensorData > 2){
		return 2;

	}
}

// Map voltage to mg/m3
function voltageToMGM3(voltage){
	// Map equation based on mg/m3 ranges (returns Y)
	// Y = (X-A)/(B-A) * (D-C) + C
	var x=voltage;
	var a=0;
	var b=1;
	var c=0;
	var d=35;

	if (voltage > 1 && voltage <= 2){
		a = 1;
		b = 2;
		c = 35;
		d = 250;
	} else if (voltage > 2){
		a = 2;
		b = 3.5;
		c = 250;
		d = 500;
	}

	return (x-a)/(b-a) * (d-c) + c;

}

// Configures and sets live data display
function changeSensorDisplay(sensorData){
	var dataDisplay = voltageToMGM3(sensorData);
	if(String(dataDisplay).length > 4){
		mainSensor.textContent = String(dataDisplay).substr(0,4);
	} else {
			mainSensor.textContent = dataDisplay;
	}
}

// Displays for background color
function changeBkgd(threat,mainRoom){
	switch (threat){
		case 0: mainRoom.style.background = "rgb(0,255,0)";
				break;

		case 1: mainRoom.style.background = "yellow";
		break;

		/*case 2: mainRoom.style.background = "orange";
		break;*/

		case 2: mainRoom.style.background = "red";
		break;

	}
}

// Displays for instructional text
function changeInstruct(threat){
	switch (threat){
		case 0: mainInstruct.textContent = "All good!";
				break;

		/*case 1: mainInstruct.textContent = "Wear your MASK!";
		break;*/

		case 1: mainInstruct.textContent = "Wear PROTECTIVE GEAR!";
		break;

		case 2: mainInstruct.textContent = "!!!GET OUT NOW!!!";
				mainInstruct.style.fontWeight = "bold"; // did not show up in tests
		break;

	}
}

// Change the instructional zone image
// based on threat alert
function changeZoneImgs(threat){
	for (var i = 0; i < zoneImgs.length; i++) {
		if(threat === i) { zoneImgs[i].classList.remove("hide-img"); console.log("zone image: "+ i)}
		else{ zoneImgs[i].classList.add("hide-img"); }
	};
}

// Change alert image based on threat alert
function changeAlertImgs(threat){
	for (var i = 0; i < alertImgs.length; i++) {
		if(threat === i) { alertImgs[i].classList.remove("hide-img"); console.log("alert image: "+ i)}
		else{ alertImgs[i].classList.add("hide-img"); }
	};
}

// Change display for zone 2 (room)
function changeZone2Display(zone2SensorData){
	var zone2ThreatLvl = assessThreat(zone2SensorData);
	changeBkgd(zone2ThreatLvl, zone2Display)
}

// Change display based on threat alert
function changeMainDisplay(threat){
	// change the main image based on alert level
	changeAlertImgs(threat);

	// change the zone instructions based on alert level
	changeZoneImgs(threat);

	// change the background color based on alert level
	changeBkgd(threat, mainRoom);

	// change the instructional text based on alert level
	changeInstruct(threat);

}

function changeMotorDisplay(mData){
	motorDisplay.textContent = mData;
}

// Get info from server
function loadDoc(loadMe, changeMe) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
     //document.getElementById("demo").innerHTML = xhttp.responseText;
     changeMe.textContent = xhttp.responseText;
     //return xhttp.responseText;
    }
  };
  xhttp.open("GET", loadMe, true);
  xhttp.send();
  //return xhttp.responseText;
}