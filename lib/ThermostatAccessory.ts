
import {changeBase} from "./Runtime";
import EnergySelectIntegrationAPI from "./EnergySelectIntegrationAPI";


var BaseAccessory, Service, Characteristic, uuid;

export default class ThermostatAccessory  {

	// Base class methods
	private addService: (any) => any;
	private getService: (any) => any;
	private services: any[];
	private log;

	static init(exportTypes) {
		BaseAccessory = exportTypes.BaseAccessory;
		Service = exportTypes.Service;
		Characteristic = exportTypes.Characteristic;
		uuid = exportTypes.uuid;

		changeBase(ThermostatAccessory, BaseAccessory);
	}

	constructor(log, api: EnergySelectIntegrationAPI, deviceData) {
		BaseAccessory.call(this, log, api, deviceData);

		/*
		// Debug
		var svc = this.getService(Service.Thermostat);
		for (var i in svc.characteristics)
		{
			var c = svc.characteristics[i];
			c.on('change', function(args) {
				//{ oldValue:oldValue, newValue:newValue, context:context }
				log.debug(this.displayName + " changed from: " + args.oldValue + " to: " + args.newValue);
			});
		}
		 */
	}

	// Abstract Implementation
	protected UpdateData(deviceData:any)
	{
		var svc = this.getService(Service.Thermostat) || this.addService(Service.Thermostat);

		// Currently it appears that only Fahrenheit is supported
		svc.getCharacteristic(Characteristic.TemperatureDisplayUnits)
			.setValue(Characteristic.TemperatureDisplayUnits.FAHRENHEIT);

		svc.getCharacteristic(Characteristic.TargetTemperature)
			.setValue(ThermostatAccessory.fahrenheitToCelsius(deviceData.set_point));

		svc.getCharacteristic(Characteristic.CurrentTemperature)
			.setValue(ThermostatAccessory.fahrenheitToCelsius(deviceData.display_temperature));

		svc.getCharacteristic(Characteristic.TargetHeatingCoolingState)
			.setValue(ThermostatAccessory.ToTargetHeatingCoolingState(deviceData.mode));

		svc.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
			.setValue(ThermostatAccessory.DetermineCurrentHeatingCoolingState(deviceData.mode, deviceData.set_point, deviceData.display_temperature));
	}

	private static fahrenheitToCelsius(temperature:number) : number
	{
		return (temperature - 32) / 1.8;
	}

	private static celsiusToFahrenheit(temperature:number) : number
	{
		return (temperature * 1.8) + 32;
	}

	private static ToTargetHeatingCoolingState(mode : ThermostatMode) : number
	{
		switch (mode) {
			case ThermostatMode.Off:
				return Characteristic.TargetHeatingCoolingState.OFF;
			case ThermostatMode.Heat:
				return Characteristic.TargetHeatingCoolingState.HEAT;
			case ThermostatMode.Cool:
				return Characteristic.TargetHeatingCoolingState.COOL;
			default:
				return Characteristic.TargetHeatingCoolingState.OFF;
		}
	}

	private static DetermineCurrentHeatingCoolingState(mode : ThermostatMode, targetTemp: number, currentTemp: number)
	{
		switch (mode) {
			case ThermostatMode.Heat:
				if (targetTemp > currentTemp) {
					return Characteristic.CurrentHeatingCoolingState.HEAT;
				}
				break;
			case ThermostatMode.Cool:
				if (targetTemp < currentTemp) {
					return Characteristic.CurrentHeatingCoolingState.COOL;
				}
				break;
		}

		return Characteristic.CurrentHeatingCoolingState.OFF;
	}
}

enum ThermostatMode {
	Off = "off",
	Heat = "heat",
	Cool = "cool",
}
