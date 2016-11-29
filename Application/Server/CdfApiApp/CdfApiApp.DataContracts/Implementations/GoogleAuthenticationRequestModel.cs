using System;
using CdfApiApp.DataContracts.Interfaces;

namespace CdfApiApp.DataContracts.Implementations
{
	public class TwitterAuthenticationRequestModel : ITwitterAuthenticationRequestModel
	{
		public String EncodedCredentials { get; set; }
	}
}
