using System;

namespace CdfApp.DataContracts.Interfaces
{
	public interface ITwitterAuthenticationRequestModel
	{
		String EncodedCredentials { get; set; }
	}
}
