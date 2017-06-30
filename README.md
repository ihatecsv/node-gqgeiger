# node-gqgeiger
[![NPM](https://nodei.co/npm/gqgeiger.png)](https://nodei.co/npm/gqgeiger/)

An abstraction library for communicating with the GQ Electronics GMC range of Geiger counters

## Note for Windows users
If you are having trouble connecting your Geiger counter via USB, it's possible that the latest Prolific drivers on your PC are rejecting the chip in the device. Click [here](http://www.totalcardiagnostics.com/support/Knowledgebase/Article/View/92/20/prolific-usb-to-serial-fix-official-solution-to-code-10-error) for a fix!

# Install
```
npm install --save gqgeiger
```

# Quick Example

```javascript
const GQGeiger = require('gqgeiger');

const myGeiger = new GQGeiger("COM4", 9600);

setInterval(function(){
	myGeiger.getCPM(function(err, cpm){
		if(err){
			console.log(err);
		}
		console.log(cpm);
	});
}, 2000);
```

# API

## new GQGeiger(string portName, number baudRate)
Connects to the Geiger counter.

__Arguments__
* portName - The name of the port to open. Windows ports are typically labeled `COMn`, where n is the port number.
* baudRate - The baud rate of the device. The default for the GMC-320 is `9600`.

## getCPM(function callback)
Gets the current counts-per-minute value from the Geiger counter.

__Arguments__
* callback(mixed err, number cpm)

## getDoseRate(function callback)
Gets the current dose rate from the Geiger counter in μSv/h.

__Arguments__
* callback(mixed err, number doseRate)

## getVoltage(function callback)
Gets the current Geiger counter battery voltage.

__Arguments__
* callback(mixed err, number voltage)

## getSerial(function callback)
Gets the Geiger counter's serial number.

__Arguments__
* callback(mixed err, string serial)

## getTemp(function callback)
Gets the current temperature from the Geiger counter in degrees Celsius.

__Arguments__
* callback(mixed err, number temp)

## getGyro(function callback)
Gets the current gyroscope values from the Geiger counter in two-byte buffers.

__Arguments__
* callback(mixed err, object gyro)
	* gyro.x - Two-byte buffer of the x value of the gyroscope
	* gyro.y - Two-byte buffer of the y value of the gyroscope
	* gyro.z - Two-byte buffer of the z value of the gyroscope
	
## reboot()
Restarts (or starts if off) the Geiger counter.

## powerOff()
Powers off the Geiger counter.

## powerOn()
Powers on the Geiger counter.
