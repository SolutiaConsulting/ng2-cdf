using System;
using CdfApiApp.DataContracts.Interfaces.Twitter;

namespace CdfApiApp.DataContracts.Implementations.Twitter
{
	public class TwitterPostRequestModel : ITwitterPostRequestModel
	{
		public String BearerToken { get; set; }
		public String UrlFragment { get; set; }
		public String PostBody { get; set; }
	}
}
