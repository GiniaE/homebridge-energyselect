# homebridge-energyselect
[Gulf Power Energy Select](https://www.gulfpower.com/residential/savings-and-energy/rebates-and-programs/energy-select) 
plugin for [Homebridge](https://github.com/nfarina/homebridge)

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-energyselect
3. Update your configuration file. See sample config.json snippet below. 

# Configuration

Configuration sample:

 ```
    "platforms": [
      {
        "platform": "EnergySelect",
        "username": "you@example.com",
        "password": "YourPa$$w0rd"
      }
    ]
```

Fields: 

* "platform": Must always be "EnergySelect" (required)
* "username": Username for your Energy Select account (required)
* "password": Password for your Energy Select account (required)
