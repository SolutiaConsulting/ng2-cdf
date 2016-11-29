using System;

namespace CdfApiApp.DataContracts.Interfaces
{
	public interface IGoogleAuthenticationRequestModel
	{
		Guid ApplicationKey { get; set; }
		String[] ScopeList { get; set; }
	}
}
