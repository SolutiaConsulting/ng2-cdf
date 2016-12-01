using System;
using CdfApiApp.DataContracts.Interfaces.AuthenticationRequestModels;

namespace CdfApiApp.DataContracts.Implementations.AuthenticationRequestModels
{
	public class AuthenticationRequestCloudCmsModel : IAuthenticationRequestCloudCmsModel
	{
		public Guid ApplicationKey { get; set; }
	}
}
