import { CdfDomainModel }	from './cdf-domain.model'; 

export class CdfClientConfigModel
{
	CloudCMSMediaUrlRoot: string;
	CloudCMSBranchId: string;
	JwPlayerKey: string;
	ConfigList : CdfDomainModel[] = [];

	constructor
	(
		cloudCMSMediaUrlRoot: string, 
		cloudCMSBranchId: string,
		jwPlayerKey: string,
		configList : CdfDomainModel[]
	)
	{
		this.CloudCMSMediaUrlRoot = cloudCMSMediaUrlRoot;
		this.CloudCMSBranchId = cloudCMSBranchId;
		this.JwPlayerKey = jwPlayerKey;
		this.ConfigList = configList;
	}
}