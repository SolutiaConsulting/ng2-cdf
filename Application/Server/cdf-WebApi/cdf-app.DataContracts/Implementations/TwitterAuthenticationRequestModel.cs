using System;

namespace CdfApp.DataContracts.Interfaces
{
	public class TwitterAuthenticationRequestModel : ITwitterAuthenticationRequestModel
	{
		public String EncodedCredentials { get; set; }
	}
}
