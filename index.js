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
		const sph = (buffer.readUInt16BE(0)/200)*0.000001;
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
}

module.exports = GQGeiger;