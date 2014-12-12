'use strict';

/**
 * Copyright (c) 2014-2015 Flying Anvil Ltd (copyright@flyinganvil.co.uk)
 * Any use of the code written here-in belongs to the company mentioned
 * above and is hereby the owner. If used, one must have strict
 * approval by the developer of the code written here-in.
 * The company may at anytime change, modify, add, or delete
 * any content contained within.
 */

var SDLTData = require('../json/data.js');

var SDLTCalc = function() {
	var self = this,
		_amount;

	Object.defineProperty(self, 'amount', {
		enumerable: true,
		get: function() {
			return _amount;
		},
		set: function(value) {
			_amount = value;
			
			self.calculate(_amount);
		}
	});
	
	// Initialise properties
	self.reset();
};

SDLTCalc.prototype.reset = function() {
	var self = this;

	self.calculatedTax = {
		residential: {
			SDLTOld: 0,
			SDLTNew: 0,
			LBTT: 0
		},
		commercial: {
			SDLTOld: 0,
			SDLTNew: 0,
			LBTT: 0
		}
	};
};

SDLTCalc.prototype.calculate = function(amount) {
	var self = this;
	
	self.reset();
	
	self.calculateSDLTOld(amount);	
	self.calculateSDLTNew(amount);
	self.calculateLBTT(amount);	
	
	// todo: change this to something more useful for node purposes?
	//console.log(self.calculatedTax); // todo: removed for web browser use

	return self.calculatedTax;
};

SDLTCalc.prototype.calculateSDLTOld = function(amount) {
	var self = this;
	
	// Calculate residential rate
	for (var rate in SDLTData.residential.SDLTOld) {
		var threshold = SDLTData.residential.SDLTOld[rate];
		
		if (!isFinite(threshold[1]) || amount <= threshold[1]) {
			self.calculatedTax.residential.SDLTOld = +((amount * (rate/100)).toFixed(2));
			break;
		}
	}
	
	// calculate commercial rate
	for (var rate in SDLTData.commercial.SDLTOld) {
		var threshold = SDLTData.commercial.SDLTOld[rate];
		
		if (!isFinite(threshold[1]) || amount <= threshold[1]) {
			self.calculatedTax.commercial.SDLTOld = +((amount * (rate/100)).toFixed(2));
			break;
		}
	}
};

SDLTCalc.prototype.calculateTax = function(amount, taxData) {
	var tmpAmount = 0,
		tmpTax = 0;

	for (var rate in taxData) {
		var threshold = taxData[rate];
		
		if (amount > threshold[0]) {
			tmpAmount = amount - threshold[0];
			if (amount > threshold[1]) {
				tmpTax += +((threshold[1] - threshold[0]) * (rate/100));
			} else {
				tmpTax += tmpAmount * (rate/100);
			}
		} 
		
		// stop looping through rates if the amount specified has no further calculations required
		if (amount <= threshold[1]) {
			break;
		}
	}
	
	return +(tmpTax.toFixed(2));
};

SDLTCalc.prototype.calculateSDLTNew = function(amount) {
	var self = this;
	
	self.calculatedTax.residential.SDLTNew = self.calculateTax(amount, SDLTData.residential.SDLTNew);
	self.calculatedTax.commercial.SDLTNew = self.calculateTax(amount, SDLTData.commercial.SDLTNew);
};

SDLTCalc.prototype.calculateLBTT = function(amount) {
	var self = this;
	
	self.calculatedTax.residential.LBTT = self.calculateTax(amount, SDLTData.residential.LBTT);
	self.calculatedTax.commercial.LBTT = self.calculateTax(amount, SDLTData.commercial.LBTT);
};

module.exports = SDLTCalc;
