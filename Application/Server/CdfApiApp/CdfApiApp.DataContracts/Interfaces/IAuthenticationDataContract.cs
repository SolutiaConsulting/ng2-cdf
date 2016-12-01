using System;

namespace CdfApiApp.DataContracts.Interfaces
{
	public interface IAuthenticationDataContract
	{
		String token_type { get; set; }
		String access_token { get; set; }
		String refresh_token { get; set; }
		String expires_in { get; set; }
	}
}