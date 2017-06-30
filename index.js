var SerialPort = require("serialport");

class GQGeiger {
	constructor(port, baud){
		this.geigerPort = new SerialPort(port, {baudrate: baud});
		this.queue = [];
		geigerPort.on('data', function(data) {
			const cD = queue.shift();
			cD.internalCallback(externalCallback, data);
		});
	}
	
	processCPM(callback, buffer){
		cpm = buff.readUInt16BE(0);
		callback(null, cpm);
	}
	getCPM(callback){
		geigerPort.write(new Buffer("<GETCPM>>", 'ascii'), function(err, results) {});
		queue.push({internalCallback: processCPM, externalCallback: callback});
	}
}

module.exports = GQGeiger;