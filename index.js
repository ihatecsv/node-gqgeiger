const SerialPort = require("serialport");

class GQGeiger {
	constructor(port, baud){
		this.geigerPort = new SerialPort(port, {baudrate: baud});
		this.queue = [];
		const tempThis = this;
		this.geigerPort.on('data', function(data) {
			const cD = tempThis.queue.shift();
			cD.internalCallback(cD.externalCallback, data);
		});
	}
	
	processCPM(callback, buffer){
		const cpm = buffer.readUInt16BE(0);
		callback(null, cpm);
	}
	getCPM(callback){
		const tempThis = this;
		this.geigerPort.write(new Buffer("<GETCPM>>", 'ascii'), function(err, results){
			if(err){
				callback(err, null);
				return;
			}
			tempThis.queue.push({internalCallback: tempThis.processCPM, externalCallback: callback});
		});
	}
}

module.exports = GQGeiger;