using System;

namespace Ng2CdfApp.DataContracts.Interfaces
{
	public interface ITwitterPostRequestModel
	{
		String BearerToken { get; set; }
		String UrlFragment { get; set; }
		String PostBody { get; set; }
	}
}
