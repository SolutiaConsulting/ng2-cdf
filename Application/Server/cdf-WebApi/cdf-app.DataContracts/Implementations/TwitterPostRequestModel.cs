using System;

namespace CdfApp.DataContracts.Interfaces
{
	public class TwitterPostRequestModel : ITwitterPostRequestModel
	{
		public String BearerToken { get; set; }
		public String UrlFragment { get; set; }
		public String PostBody { get; set; }
	}
}
