using System;

namespace CdfApiApp.DataContracts.Interfaces.AuthenticationRequestModels
{
	public interface IAuthenticationRequestGoogleModel : IAuthenticationRequestModel
	{
		String[] ScopeList { get; set; }
	}
}
