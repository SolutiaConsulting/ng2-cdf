using System;
using CdfApp.DataContracts.Interfaces;

namespace CdfApp.DataContracts.Implementations
{
	public class ApplicationApiDomainCredential : IApplicationApiDomainCredential
	{
		public Int32 ApplicationId { get; set; }
		public String ApplicationName { get; set; }
		public Int32 ApiDomainId { get; set; }
		public String ApiDomainName { get; set; }
		public Int32 CredentialTypeId { get; set; }
		public String CredentialTypeName { get; set; }
		public String CredentialTypeValue { get; set; }
	}
}
