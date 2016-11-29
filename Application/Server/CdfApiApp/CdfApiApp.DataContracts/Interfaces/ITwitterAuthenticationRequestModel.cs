using System;

namespace CdfApiApp.DataContracts.Interfaces
{
	public interface ITwitterAuthenticationRequestModel
	{
		String EncodedCredentials { get; set; }
	}
}
