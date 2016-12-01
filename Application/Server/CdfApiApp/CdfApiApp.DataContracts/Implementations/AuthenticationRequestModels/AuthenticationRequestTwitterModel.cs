using System;
using CdfApiApp.DataContracts.Interfaces.AuthenticationRequestModels;

namespace CdfApiApp.DataContracts.Implementations.AuthenticationRequestModels
{
	public class AuthenticationRequestTwitterModel : IAuthenticationRequestTwitterModel
	{
		public Guid ApplicationKey { get; set; }
	}
}
