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
		const cpm = buffer.readUInt16BE(0);
		callback(null, cpm);
	}
	getCPM(callback){
		this.reqData("<GETCPM>>", this.processCPM, callback);
	}
	
	processSPH(buffer, callback){
		const sph = (buffer.readUInt16BE(0)/200);
		callback(null, sph);
	}
	getSPH(callback){
		this.reqData("<GETCPM>>", this.processSPH, callback);
	}
	
	processVoltage(buffer, callback){
		const voltage = buffer.readUInt8(0)/10;
		callback(null, voltage);
	}
	getVoltage(callback){
		this.reqData("<GETVOLT>>", this.processVoltage, callback);
	}
	
	processSerial(buffer, callback){
		const serial = buffer.toString('hex');
		callback(null, serial);
	}
	getSerial(callback){
		this.reqData("<GETSERIAL>>", this.processSerial, callback);
	}
	
	processTemp(buffer, callback){
		const integerPart = buffer.readUInt8(0);
		const decimalPart = buffer.readUInt8(1);
		const negative = buffer.readUInt8(2);
		let temp = parseFloat(integerPart + "." + decimalPart);
		if(negative){
			temp = 0 - temp;
		}
		callback(null, temp);
	}
	getTemp(callback){
		this.reqData("<GETTEMP>>", this.processTemp, callback);
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