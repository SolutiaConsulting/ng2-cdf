using System;

namespace CdfApp.DataContracts.Interfaces
{
	public interface ITwitterGetRequestModel
	{
		String BearerToken { get; set; }
		String UrlFragment { get; set; }
		Boolean IsValid();
	}
}
