using System;

namespace Ng2CdfApp.DataContracts.Interfaces
{
	public class TwitterGetRequestModel : ITwitterGetRequestModel
	{
		public String BearerToken { get; set; }
		public String UrlFragment { get; set; }
	}
}
