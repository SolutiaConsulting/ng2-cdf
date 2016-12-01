using System;
using CdfApiApp.DataContracts.Interfaces.AuthenticationRequestModels;

namespace CdfApiApp.DataContracts.Implementations.AuthenticationRequestModels
{
	public class AuthenticationRequestGoogleModel : IAuthenticationRequestGoogleModel
	{
		public Guid ApplicationKey { get; set; }
		public String[] ScopeList { get; set; }
	}
}
