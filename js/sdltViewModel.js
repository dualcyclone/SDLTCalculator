'use strict';

/**
 * Copyright (c) 2014-2015 Flying Anvil Ltd (copyright@flyinganvil.co.uk)
 * Any use of the code written here-in belongs to the company mentioned
 * above and is hereby the owner. If used, one must have strict
 * approval by the developer of the code written here-in.
 * The company may at anytime change, modify, add, or delete
 * any content contained within.
 */

var ko = require('knockout'),
    _ = require('underscore'),
    SDLTCalc = require('SDLTCalc'),
    sdltEl = {
        sdltAbout: document.getElementById('sdltAbout'),
        sdltCalcCont: document.getElementById('sdltCalcCont'),
        sdltRatesResidential: document.getElementById('sdltRatesResidential'),
        sdltRatesCommercial: document.getElementById('sdltRatesCommercial')
    },
    hash = window.location.hash,
    activePage = hash.substring(hash.indexOf('#')+1, hash.indexOf('-link'));

/**
 * Knockout VM for web form
 */
var sdltViewModel = function() {
    var self = this,
        sdltCalc = new SDLTCalc(),
        priceHitTimeout = 0,
        valueRegEx = /[A-Za-z|?%$£\"\'@;:#~\[\{\]\}!^\&*\(\)\-_\=\+]/;

    self.sdltValue = ko.observable(0);
    self.sdltValueAsCurrency = ko.computed(function() {
        return self.sdltValue().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    });
    self.sale = ko.observable('all'); // 'fre' / 'com' / 'all'
    self.type = ko.observable('all'); // 'res' / 'lse' / 'all'

    self.error = ko.observable(false);

    self.sdltTax = ko.observable(sdltCalc.calculatedTax);

    self.sdltValue.subscribe(function(newValue) {
        clearTimeout(priceHitTimeout);
        priceHitTimeout = setTimeout(function() {
            ga('set', 'metric1', newValue);
        }, 1000);

        sdltCalc.reset();
        self.sdltTax(sdltCalc.calculatedTax);
        self.error(valueRegEx.test(newValue));

        if (!self.error()) {
            newValue = newValue.replace(/[^\d.]/g, '');

            self.sdltTax(sdltCalc.calculate(newValue));
        }
    });

    self.handleSubmit = function() {
        return false;
    };

    self.formatValue = function(value, oldValue) {
        return (value > 0 ? (oldValue !== value ? "£" + value.toFixed(2) : 'No change') : 'Zero');
    };

    self.formatDifference = function(value, oldValue) {
        var diff = (value - oldValue);

        return value === 0 || diff === 0 ? 'No difference' : ' (' + (diff > 0 ? '+' : '') + diff.toFixed(2) + ')';
    };

    self.getSDLTStyle = function(oldVal, newVal) {
        return self.SDLTStyles[(oldVal === newVal ? (newVal > 0 ? 'same' : 'zero') : (oldVal > newVal ? 'less' : 'more'))];
    };

    self.isSale = function(sale) {
        return self.sale() === 'all' || self.sale() === sale;
    };

    self.isType = function(type) {
        return self.type() === 'all' || self.type() === type;
    };
};

sdltViewModel.prototype.SDLTStyles = {
    more: 'more',
    less: 'less',
    same: 'same',
    zero: 'zero'
};

sdltViewModel.prototype.showPage = function(root, evt) {
    var self = this,
        anchor = evt.target,
        page = anchor.href.substring(anchor.href.indexOf('#')+1, anchor.href.indexOf('-link'));

    self.activatePage(page);

    // Report page view
    ga('send', 'pageview');

    // DON'T SCROLL!
    setTimeout(function(){
        window.scroll(0,0);
    });

    return true;
};

sdltViewModel.prototype.activatePage = function(page) {
    for (var i in sdltEl) {
        if (sdltEl.hasOwnProperty(i)) {
            sdltEl[i].style.display = (page === i) ? 'block' : 'none';
        }
    }
};

// default display from homepage
sdltEl.sdltCalcCont.style.display = 'none';
sdltEl.sdltRatesResidential.style.display = 'none';
sdltEl.sdltRatesCommercial.style.display = 'none';
sdltEl.sdltAbout.style.display = 'none';

sdltViewModel.prototype.activatePage(activePage === '' ? 'sdltAbout' : activePage);

// JavaScript is working, so display the menu
document.getElementById('sdltMenu').style.display = '';
document.getElementById('fomLink').style.display = '';

// Activates knockout.js
ko.applyBindings(new sdltViewModel());