import EnergySelectIntegrationAPI from "./lib/EnergySelectIntegrationAPI";
import EnergySelectPlatform from "./lib/Platform";
import BaseAccessory from "./lib/BaseAccessory";
import ThermostatAccessory from "./lib/ThermostatAccessory";

module.exports = function (homebridge) {
  var exportTypes = {
    Accessory: homebridge.hap.Accessory,
	Platform: homebridge.hap.Platform,
    Service: homebridge.hap.Service,
    Characteristic: homebridge.hap.Characteristic,
    uuid: homebridge.hap.uuid,
	BaseAccessory:null,
  };

  BaseAccessory.init(exportTypes);
  exportTypes.BaseAccessory = BaseAccessory;

  ThermostatAccessory.init(exportTypes);

  EnergySelectPlatform.init(exportTypes);

  homebridge.registerPlatform("homebridge-energyselect", "EnergySelect", EnergySelectPlatform);
};
