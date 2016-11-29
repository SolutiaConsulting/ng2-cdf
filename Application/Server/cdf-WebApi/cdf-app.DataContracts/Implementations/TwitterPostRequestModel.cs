using System;
using CdfApp.DataContracts.Interfaces;

namespace CdfApp.DataContracts.Implementations
{
	public class TwitterPostRequestModel : ITwitterPostRequestModel
	{
		public String BearerToken { get; set; }
		public String UrlFragment { get; set; }
		public String PostBody { get; set; }
	}
}
