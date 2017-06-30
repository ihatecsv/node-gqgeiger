const SerialPort = require("serialport");

class GQGeiger {
	constructor(port, baud){
		this.geigerPort = new SerialPort(port, {baudrate: baud});
		this.queue = [];
		const tempThis = this;
		this.geigerPort.on('data', function(data) {
			const cD = tempThis.queue.shift();
			cD.internalCallback(data, cD.externalCallback);
		});
	}
	
	sendCommand(command){
		this.geigerPort.write(new Buffer(command, 'ascii'), function(err, results){});
	}
	
	reqData(command, processFunc, callback){
		const tempThis = this;
		this.geigerPort.write(new Buffer(command, 'ascii'), function(err, results){
			if(err){
				callback(err, null);
				return;
			}
			tempThis.queue.push({internalCallback: processFunc, externalCallback: callback});
		});
	}
	
	processCPM(buffer, callback) {
		try{
			const cpm = buffer.readUInt16BE(0);
			callback(null, cpm);
		}catch(e){
			callback(e, null);
		}
	}
	getCPM(callback){
		this.reqData("<GETCPM>>", this.processCPM, callback);
	}
	
	processDoseRate(buffer, callback){
		try{
			const doseRate = buffer.readUInt16BE(0)/200;
			callback(null, doseRate);
		}catch(e){
			callback(e, null);
		}
	}
	getDoseRate(callback){
		this.reqData("<GETCPM>>", this.processDoseRate, callback);
	}
	
	processVoltage(buffer, callback){
		try{
			const voltage = buffer.readUInt8(0)/10;
			callback(null, voltage);
		}catch(e){
			callback(e, null);
		}
	}
	getVoltage(callback){
		this.reqData("<GETVOLT>>", this.processVoltage, callback);
	}
	
	processSerial(buffer, callback){
		try{
			const serial = buffer.toString('hex');
			callback(null, serial);
		}catch(e){
			callback(e, null);
		}
	}
	getSerial(callback){
		this.reqData("<GETSERIAL>>", this.processSerial, callback);
	}
	
	processTemp(buffer, callback){
		try{
			const integerPart = buffer.readUInt8(0);
			const decimalPart = buffer.readUInt8(1);
			const negative = buffer.readUInt8(2);
			let temp = parseFloat(integerPart + "." + decimalPart);
			if(negative){
				temp = 0 - temp;
			}
			callback(null, temp);
		}catch(e){
			callback(e, null);
		}
	}
	getTemp(callback){
		this.reqData("<GETTEMP>>", this.processTemp, callback);
	}
	
	processGyro(buffer, callback){
		try{
			let gyro = {};
			gyro.x = buffer.slice(0, 2);
			gyro.y = buffer.slice(2, 4);
			gyro.z = buffer.slice(4, 6);
			callback(null, gyro);
		}catch(e){
			callback(e, null);
		}
	}
	getGyro(callback){
		this.reqData("<GETGYRO>>", this.processGyro, callback);
	}
	
	reboot(){
		this.sendCommand("<REBOOT>>");
	}
	
	powerOff(){
		this.sendCommand("<POWEROFF>>");
	}
	
	powerOn(){
		this.sendCommand("<POWERON>>");
	}
}

module.exports = GQGeiger;