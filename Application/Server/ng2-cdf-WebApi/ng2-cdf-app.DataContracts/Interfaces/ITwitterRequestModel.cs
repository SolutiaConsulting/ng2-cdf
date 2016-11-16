using System;

namespace Ng2CdfApp.DataContracts.Interfaces
{
	public interface ITwitterRequestModel
	{
		String UrlFragment { get; set; }
		String BearerToken { get; set; }
	}
}
