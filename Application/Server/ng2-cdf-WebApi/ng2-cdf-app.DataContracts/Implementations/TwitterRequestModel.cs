using System;

namespace Ng2CdfApp.DataContracts.Interfaces
{
	public class TwitterRequestModel : ITwitterRequestModel
	{
		public String UrlFragment { get; set; }
		public String BearerToken { get; set; }
	}
}
