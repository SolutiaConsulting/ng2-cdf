using System;

namespace CdfApiApp.DataContracts.Interfaces
{
	public interface ITwitterPostRequestModel
	{
		String BearerToken { get; set; }
		String UrlFragment { get; set; }
		String PostBody { get; set; }
	}
}
