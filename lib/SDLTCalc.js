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
		freehold: {
			residential: {
				SDLTOld: 0,
				SDLTNew: 0,
				LBTT: 0
			},
			commercial: {
				SDLT: 0,
				LBTT: 0
			}
		},
		leasehold: {
			residential: {
				SDLTOldLow: 0,
				SDLTOldHigh: 0,
				SDLTNew: 0,
				LBTT: 0
			},
			commercial: {
				SDLTOldLow: 0,
				SDLTOldHigh: 0,
				SDLTNewLow: 0,
				SDLTNewHigh: 0,
				LBTT: 0
			}
		}
	};
};

SDLTCalc.prototype.calculate = function(amount) {
	var self = this;
	
	self.reset();
	
	self.calculateSDLTOld(amount);	
	self.calculateSDLTNew(amount);
	self.calculateLBTT(amount);

	return self.calculatedTax;
};

SDLTCalc.prototype.calculateSDLTOld = function(amount) {
	var self = this;
	
	// Calculate residential freehold rate
	for (var rate in SDLTData.freehold.residential.SDLTOld) {
		var threshold = SDLTData.freehold.residential.SDLTOld[rate];

		if (!isFinite(threshold[1]) || amount <= threshold[1]) {
			self.calculatedTax.freehold.residential.SDLTOld = +((amount * (rate/100)).toFixed(2));
			break;
		}
	}

	// Calculate residential leasehold rate (low)
	for (var rate in SDLTData.leasehold.residential.SDLTOldLow) {
		var threshold = SDLTData.leasehold.residential.SDLTOldLow[rate];

		if (!isFinite(threshold[1]) || amount <= threshold[1]) {
			self.calculatedTax.leasehold.residential.SDLTOldLow = +((amount * (rate/100)).toFixed(2));
			break;
		}
	}

	// Calculate residential leasehold rate (high)
	self.calculatedTax.leasehold.residential.SDLTOldHigh = self.calculateTax(amount, SDLTData.leasehold.residential.SDLTOldHigh);

	// calculate commercial freehold rate
	for (var rate in SDLTData.freehold.commercial.SDLT) {
		var threshold = SDLTData.freehold.commercial.SDLT[rate];
		
		if (!isFinite(threshold[1]) || amount <= threshold[1]) {
			self.calculatedTax.freehold.commercial.SDLT = +((amount * (rate/100)).toFixed(2));
			break;
		}
	}

	// calculate commercial leasehold rate (low)
	for (var rate in SDLTData.leasehold.commercial.SDLTOldLow) {
		var threshold = SDLTData.leasehold.commercial.SDLTOldLow[rate];

		if (!isFinite(threshold[1]) || amount <= threshold[1]) {
			self.calculatedTax.leasehold.commercial.SDLTOldLow = +((amount * (rate/100)).toFixed(2));
			break;
		}
	}

	// calculate commercial leasehold rate (high)
	for (var rate in SDLTData.leasehold.commercial.SDLTOldHigh) {
		var threshold = SDLTData.leasehold.commercial.SDLTOldHigh[rate];

		if (!isFinite(threshold[1]) || amount <= threshold[1]) {
			self.calculatedTax.leasehold.commercial.SDLTOldHigh = +((amount * (rate/100)).toFixed(2));
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

	// freehold
	self.calculatedTax.freehold.residential.SDLTNew = self.calculateTax(amount, SDLTData.freehold.residential.SDLTNew);

	// leasehold
	self.calculatedTax.leasehold.residential.SDLTNew = self.calculateTax(amount, SDLTData.leasehold.residential.SDLTNew);
	self.calculatedTax.leasehold.commercial.SDLTNewLow = self.calculateTax(amount, SDLTData.leasehold.commercial.SDLTNewLow);
	self.calculatedTax.leasehold.commercial.SDLTNewHigh = self.calculateTax(amount, SDLTData.leasehold.commercial.SDLTNewHigh);
};

SDLTCalc.prototype.calculateLBTT = function(amount) {
	var self = this;

	// freehold
	self.calculatedTax.freehold.residential.LBTT = self.calculateTax(amount, SDLTData.freehold.residential.LBTT);
	self.calculatedTax.freehold.commercial.LBTT = self.calculateTax(amount, SDLTData.freehold.commercial.LBTT);

	// leasehold
	self.calculatedTax.leasehold.residential.LBTT = self.calculateTax(amount, SDLTData.leasehold.residential.LBTT);
	self.calculatedTax.leasehold.commercial.LBTT = self.calculateTax(amount, SDLTData.leasehold.commercial.LBTT);
};

module.exports = SDLTCalc;
