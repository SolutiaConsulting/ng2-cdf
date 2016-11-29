using System;

namespace CdfApiApp.DataContracts.Interfaces
{
	public interface IApplicationApiDomainCredential
	{
		Int32 ApplicationId { get; set; }
		String ApplicationName { get; set; }
		Int32 ApiDomainId { get; set; }
		String ApiDomainName { get; set; }
		Int32 CredentialTypeId { get; set; }
		String CredentialTypeName { get; set; }
		String CredentialTypeValue { get; set; }
	}
}
