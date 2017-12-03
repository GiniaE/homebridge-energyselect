
import {changeBase} from "./Runtime";
import EnergySelectIntegrationAPI from "./EnergySelectIntegrationAPI";
import * as Promise from 'bluebird';

var Accessory, Service, Characteristic, uuid;

export default abstract class BaseAccessory {
	private data: any;
	private api: EnergySelectIntegrationAPI;

	protected log;
	private name: string;

	// Base class methods
	private addService: (any) => any;
	private getService: (any) => any;
	private services: any[];
	private uuid_base: string;

	static init(exportTypes) {
		Accessory = exportTypes.Accessory;
		Service = exportTypes.Service;
		Characteristic = exportTypes.Characteristic;
		uuid = exportTypes.uuid;

		changeBase(BaseAccessory, Accessory);
	}

	constructor(log, api: EnergySelectIntegrationAPI, deviceData, resetInterval?: number) {
		var name = deviceData.display_name;
		var id = uuid.generate('energyselect.' + api.PremiseId + '.' + deviceData.id);
		Accessory.call(this, name, id);
		this.uuid_base = id;
		this.name = name;
		this.log = log;
		this.api = api;
		this.UpdateDataInternal(deviceData);

		setInterval(this.OnReloadTimer.bind(this), resetInterval || 5000);
	}

	private OnReloadTimer()
	{
		this.ReloadData()
			.catch(this.log.error);
	}

	protected ReloadData() : Promise<any>
	{
		return this.api.getDevice(this.getDeviceKey())
			.then(this.UpdateDataInternal.bind(this));
	}

	private UpdateDataInternal(deviceData:any)
	{
		this.data = deviceData;
		this.UpdateData(deviceData);
	}

	protected abstract UpdateData(deviceData:any);

	getServices(): any {
		return this.services;
	};

	getDeviceKey(): string {
		return this.data._links.self.href;
	}
}
