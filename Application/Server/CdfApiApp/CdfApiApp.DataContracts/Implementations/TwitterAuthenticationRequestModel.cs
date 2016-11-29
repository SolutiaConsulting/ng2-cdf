using CdfApiApp.DataContracts.Interfaces;
using System;

namespace CdfApiApp.DataContracts.Implementations
{
	public class GoogleAuthenticationRequestModel : IGoogleAuthenticationRequestModel
	{
		public Guid ApplicationKey { get; set; }
		public String[] ScopeList { get; set; }
	}
}
