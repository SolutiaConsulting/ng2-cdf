using System;

namespace Ng2CdfApp.DataContracts.Interfaces
{
	public class TwitterAuthenticationRequestModel : ITwitterAuthenticationRequestModel
	{
		public String EncodedCredentials { get; set; }
	}
}
