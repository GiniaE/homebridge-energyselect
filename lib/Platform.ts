import * as Promise from 'bluebird';
import {changeBase} from "./Runtime";
import EnergySelectIntegrationAPI from "./EnergySelectIntegrationAPI";
import ThermostatAccessory from "./ThermostatAccessory";


var Platform, Service, Characteristic, uuid;


export default class EnergySelectPlatform
{
	log: any;
	config: any;

	static init(exportTypes) {
		Platform = exportTypes.Accessory;
		Service = exportTypes.Service;
		Characteristic = exportTypes.Characteristic;
		uuid = exportTypes.uuid;

		changeBase(EnergySelectPlatform, Platform);
	}

	constructor(log, config) {
		// auth info
		this.config = config;

		this.log = log;

	}

	accessories(callback) : any{
		var self = this;
		var api = new EnergySelectIntegrationAPI();
		api.login(this.config.username, this.config.password)
			.then(function () {
				return Promise.map(api.Devices, api.getDevice.bind(api));
			})
			.map(function (device : any) {
				if(device.dcu != 1){
					//todo: now with more accessories
					return new ThermostatAccessory(self.log, api, device);
				}
				else {
					return null;
				}
			})
			.filter(function (accessory: any) {
				return accessory;
			})
			.then(function(accessories) {
				if (callback) {
					callback(accessories);
				}
			})
			.catch(function(err) {
				self.log.error(err);
				if (callback) {
					callback([]);
				}
			});

	};

}