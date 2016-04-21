<?php
	while (true){
		// Open stream from USB serial port 	$fp = fopen("/dev/cu.usbmodem1411", "r");
		$fp = fopen("/dev/cu.usbmodem1411", "r");
		if (!$fp) {
		echo "Error: Could not open serial port.";
		die();
		}
		// Read 256 bytes of stream and close stream
		// Increase number of bytes as more sensors are added!
		$sensorDataStream = fread($fp, 256);
		fclose($fp);
		
		echo $sensorDataStream;
		echo "<br /><br />";
	
		// Split the stream into different readings
		$sensorsReadings = explode(";", $sensorDataStream);
		// Select third reading as our measurement because the
		// Arduino doesn't send out valid data for first two readings
		$sensorReadings = explode(",", $sensorsReadings[2]);
		
		foreach ($sensorReadings as $sensorReading) {
			// Create multidimensional array
			$sensorArray = explode(":", $sensorReading);
			print_r ($sensorArray);
			
			
			file_put_contents("logs/".$sensorArray[0].".txt", $sensorArray[1]);
		}
		// Controls how often the php file loops (I put the hacky in hackathon)
		sleep(2);
	}	
?>