using System;

namespace CdfApiApp.DataContracts.Interfaces.AuthenticationRequestModels
{
	public interface IAuthenticationRequestModel
	{
		Guid ApplicationKey { get; set; }
	}
}
