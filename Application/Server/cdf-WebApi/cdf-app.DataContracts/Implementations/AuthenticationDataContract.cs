using System;
using CdfApp.DataContracts.Interfaces;

namespace CdfApp.DataContracts.Implementations
{
	public class AuthenticationDataContract : IAuthenticationDataContract
	{
		public String token_type { get; set; }
		public String access_token { get; set; }
	}
}
