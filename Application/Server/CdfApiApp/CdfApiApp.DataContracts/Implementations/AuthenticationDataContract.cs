using System;
using CdfApiApp.DataContracts.Interfaces;

namespace CdfApiApp.DataContracts.Implementations
{
	public class AuthenticationDataContract : IAuthenticationDataContract
	{
		public String token_type { get; set; }
		public String access_token { get; set; }
	}
}
