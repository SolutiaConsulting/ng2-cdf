using System;
using Ng2CdfApp.DataContracts.Interfaces;

namespace Ng2CdfApp.DataContracts.Implementations
{
	public class AuthenticationDataContract : IAuthenticationDataContract
	{
		public String token_type { get; set; }
		public String access_token { get; set; }
	}
}
