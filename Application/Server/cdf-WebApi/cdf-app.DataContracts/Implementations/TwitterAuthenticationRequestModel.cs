using System;
using CdfApp.DataContracts.Interfaces;

namespace CdfApp.DataContracts.Implementations
{
	public class TwitterAuthenticationRequestModel : ITwitterAuthenticationRequestModel
	{
		public String EncodedCredentials { get; set; }
	}
}
