'use strict';

const Configuration = require('./Configuration');
const Errors		= require('./utils/Errors');
const Request 		= require('./Request');

const Payment		= require('./resources/Payment');
const Capture		= require('./resources/Capture');
const Transfert		= require('./resources/Transfert');

/**
 * MonCash SDK client for Digicel MonCash (Haiti) payments and transfers.
 */
class Moncash {
    /**
     * @param {string|object} [config] - Client ID or configuration object
     */
    constructor(config) {
		if (arguments[0]) {
			this.configure(config);
		}
    }
	
	errors = Errors.MoncashError.types;

	/**
	 * Configure or reconfigure the SDK instance.
	 * @param {string|object} config - Client credentials or options object
	 * @returns {Moncash} Configured instance (chainable)
	 */
	configure(config){
		this.config = new Configuration(config);

		this._request = new Request(this.config,{
			'Content-Type': 'application/json',
			'User-Agent':this.config.userAgent
		});

		this.version = this.config.sdkVersion;

		this.payment 	= new Payment(this.config,this._request);
		this.capture 	= new Capture(this.config,this._request);
		this.transfert 	= new Transfert(this.config,this._request);

		/**
		 * @deprecated Use `moncash.transfert` instead. This alias is kept for backward compatibility.
		 * @type {Transfert}
		 */
		this.transfer = this.transfert;

		return this;
	}
}

module.exports = Moncash;
