using System;

namespace CdfApiApp.DataContracts.Interfaces.Twitter
{
	public interface ITwitterGetRequestModel
	{
		String BearerToken { get; set; }
		String UrlFragment { get; set; }
		Boolean IsValid();
	}
}
