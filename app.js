'use strict';

/**
 * Copyright (c) 2014-2015 Flying Anvil Ltd (copyright@flyinganvil.co.uk)
 * Any use of the code written here-in belongs to the company mentioned
 * above and is hereby the owner. If used, one must have strict
 * approval by the developer of the code written here-in.
 * The company may at anytime change, modify, add, or delete
 * any content contained within.
 */

var sdltCalc = require('./lib/SDLTCalc.js'),
    calc = new sdltCalc();

console.log(calc.calculate(process.argv[2]));