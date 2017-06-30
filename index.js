var SerialPort = require("serialport");

class GQGeiger {
	constructor(port, baud){
		this.geigerPort = new SerialPort(port, {baudrate: baud});
		this.queue = [];
		this.geigerPort.on('data', function(data) {
			const cD = this.queue.shift();
			cD.internalCallback(externalCallback, data);
		});
	}
	
	processCPM(callback, buffer){
		cpm = buffer.readUInt16BE(0);
		callback(null, cpm);
	}
	getCPM(callback){
		this.geigerPort.write(new Buffer("<GETCPM>>", 'ascii'), function(err, results){
			if(err){
				callback(err, null);
				return;
			}
			this.queue.push({internalCallback: this.processCPM, externalCallback: callback});
		});
	}
}

module.exports = GQGeiger;