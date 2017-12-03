import * as rp from 'request-promise';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

export default class EnergySelectIntegrationAPI {

	private static defaultURL = "https://ws5.powerportal.com/gpc/engagement/api_users/sign_in";

	private UserLogin:string;
	private UserToken:string;
	private BaseUrl: string;

	public PremiseId:string;
	public Devices: string[];

	public login(username: string, password: string, loginUrl?: string) : Promise<any>
	{
		if(!loginUrl)
		{
			loginUrl = EnergySelectIntegrationAPI.defaultURL;
		}

		return rp({
			method: 'POST',
			uri: loginUrl,
			form: {
				"api_user[login]": username,
				"api_user[password]": password,
				preferred_format: "json",
				checkPassRequired : true,
				extras : true
			}
		})
			.then(function (parsedBody) {
				var body = JSON.parse(parsedBody);
				this.UserLogin = body.portal_user.login;
				this.PremiseId = body.premises[0].id;
				this.UserToken = body.portal_user.authentication_token;
				this.BaseUrl = body.premises[0].cep_url;
				this.Devices = _.map(body.premises[0]._links["comv:installed-devices"], "href");
			}.bind(this));

	}

	public getDevice(device:string) : Promise<any>
	{
		return rp({
			method: 'GET',
			uri: this.BaseUrl + device,
			qs: {
				"_": (new Date()).getTime()
			},
			headers: {
				"X-PortalUser-Premise": this.PremiseId,
				"X-PortalUser-Login": this.UserLogin,
				"X-PortalUser-Token": this.UserToken
			}
		})
			.then(function (parsedBody) {
				var body = JSON.parse(parsedBody);
				return body;
			}.bind(this));

	}
}