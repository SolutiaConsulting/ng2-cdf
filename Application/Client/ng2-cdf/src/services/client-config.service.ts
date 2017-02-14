import { 
	CdfClientConfigModel,
	CdfDomainModel 
} 							from "../models/index";

export class ClientConfigService 
{
	static CdfClientConfigModel: CdfClientConfigModel;

	static readonly CDF_WEBAPI_BASE_URL = 'http://webapi.cdf.cloud/api/';

	//BUILD MEDIA URL FOR CLOUD CMS NODE ID
	static BuildCloudCmsMediaUrl(nodeId: string) : string
	{ 
		return ClientConfigService.CdfClientConfigModel.CloudCMSMediaUrlRoot + '/' + nodeId + '?branchId=' + ClientConfigService.CdfClientConfigModel.CloudCMSBranchId;
	};		


	//GET DOMAIN CONFIGURATION VALUES
	static GetConfigModelByDomainName(domainName: string) : CdfDomainModel
	{
		let configModel : CdfDomainModel;

		//FIND CONFIG IN LIST WITH SAME DOMAIN NAME
		for (let entry of ClientConfigService.CdfClientConfigModel.ConfigList) 
		{
			if(entry.Domain.toUpperCase() === domainName.toUpperCase())
			{
				configModel = entry;
				break;
			}
		}

		return configModel;
	};	


	//GET JW PLAYER KEY
	static GetJwPlayerKey(): string
	{
		return ClientConfigService.CdfClientConfigModel.JwPlayerKey;
	};
}