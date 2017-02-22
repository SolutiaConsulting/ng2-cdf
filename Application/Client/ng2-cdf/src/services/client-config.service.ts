import { 
	CdfClientConfigModel,
	CdfDomainModel 
} 							from "../models/index";

export class ClientConfigService 
{
	static CdfClientConfigModel: CdfClientConfigModel;

	//static readonly CDF_WEBAPI_BASE_URL = 'http://webapi.cdf.cloud/api/';
	static readonly CDF_WEBAPI_BASE_URL = 'http://cdf-api-local.webapi.cdf.cloud/api/';

	//BUILD MEDIA URL FOR CLOUD CMS NODE ID
	static BuildCloudCmsMediaUrl(nodeId: string) : string
	{ 
		return ClientConfigService.CdfClientConfigModel.CloudCMSMediaUrlRoot + '/' + nodeId + '?branchId=' + ClientConfigService.CdfClientConfigModel.CloudCMSBranchId;
	};		

	//GET JW PLAYER KEY
	static GetJwPlayerKey(): string
	{
		return ClientConfigService.CdfClientConfigModel.JwPlayerKey;
	};
}