import { CdfOAuth2Model } from './cdf-oauth2.model';

export class CdfConfigModel
{
	Domain: string;
	Settings: CdfOAuth2Model;

	constructor(domain: string, settings: CdfOAuth2Model)
	{ 
		this.Domain = domain;
		this.Settings = settings;
	};
}