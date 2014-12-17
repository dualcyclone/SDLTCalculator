module.exports = {
	freehold: {
		residential: {
			// Cliff edge system: use rate for complete amount
			SDLTOld: {
				0: [0, 125000],
				1: [125000, 250000],
				3: [250000, 500000],
				4: [500000, 1000000],
				5: [1000000, 2000000],
				7: [2000000, (0/0)] // upper rate is infinite
			},

			// Scaled system: Calculate proportion at appropriate rate and add together
			SDLTNew: {
				0: [0, 125000],
				2: [125000, 250000],
				5: [250000, 925000],
				10: [925000, 1500000],
				12: [1500000, (0/0)] // upper rate is infinite
			},

			// Scaled system: Calculate proportion at appropriate rate and add together
			LBTT: {
				0: [0, 135000],
				2: [135000, 250000],
				10: [250000, 1000000],
				12: [1000000, (0/0)] // upper rate is infinite
			}
		},
		commercial: {
			// Cliff edge system: use rate for complete amount
			SDLT: {
				0: [0, 150000],
				1: [150000, 250000],
				3: [250000, 500000],
				4: [500000, (0/0)] // upper rate is infinite
			},

			// Scaled system: Calculate proportion at appropriate rate and add together
			LBTT: {
				0: [0, 150000],
				3: [150000, 350000],
				4.5: [350000, (0/0)] // upper rate is infinite
			}
		}
	},

	// todo: LEASEHOLD RATES MAY NOT BE ACCURATE!!
	leasehold: {
		residential: {
			// Cliff edge system: use rate for complete amount - low rent
			SDLTOldLow: {
				0: [0, 125000],
				1: [125000, 250000],
				3: [250000, 500000],
				4: [500000, 1000000],
				5: [1000000, 2000000],
				7: [2000000, (0/0)] // upper rate is infinite
			},

			// Scaled system: Calculate proportion at appropriate rate and add together - high rent
			SDLTOldHigh: {
				0: [0, 125000],
				1: [125000, (0/0)] // upper rate is infinite
			},

			// Scaled system: Calculate proportion at appropriate rate and add together
			SDLTNew: {
				0: [0, 125000],
				1: [125000, (0/0)] // upper rate is infinite
			},

			// Scaled system: Calculate proportion at appropriate rate and add together
			LBTT: {
				0: [0, 150000],
				1: [150000, (0/0)] // upper rate is infinite
			}
		},
		commercial: {
			// Cliff edge system: use rate for complete amount - low rent
			SDLTOldLow: {
				0: [0, 150000],
				1: [150000, 250000],
				3: [250000, 500000],
				4: [500000, (0/0)] // upper rate is infinite
			},

			// Cliff edge system: use rate for complete amount - high rent
			SDLTOldHigh: {
				1: [0, 250000],
				3: [250000, 500000],
				4: [500000, (0/0)] // upper rate is infinite
			},

			// Scaled system: Calculate proportion at appropriate rate and add together - low rent
			SDLTNewLow: {
				0: [0, 150000],
				1: [150000, 250000],
				3: [250000, 500000],
				4: [500000, (0/0)] // upper rate is infinite
			},

			// Scaled system: Calculate proportion at appropriate rate and add together - high rent
			SDLTNewHigh: {
				1: [0, 250000],
				3: [250000, 500000],
				4: [500000, (0/0)] // upper rate is infinite
			},

			// Scaled system: Calculate proportion at appropriate rate and add together
			LBTT: {
				0: [0, 150000],
				1: [150000, (0/0)] // upper rate is infinite
			}
		}
	}
};
