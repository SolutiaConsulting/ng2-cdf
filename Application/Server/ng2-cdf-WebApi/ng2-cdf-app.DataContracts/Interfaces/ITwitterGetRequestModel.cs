using System;

namespace Ng2CdfApp.DataContracts.Interfaces
{
	public interface ITwitterGetRequestModel
	{
		String BearerToken { get; set; }
		String UrlFragment { get; set; }
	}
}
