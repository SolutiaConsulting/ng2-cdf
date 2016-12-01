using System.ComponentModel;

namespace CdfApiApp.Common.Enums
{
	public enum CredentialTypeEnum
	{
		[Description("Google Service Account")]
		GoogleServiceAccount = 1,
		[Description("Twitter Application Only Account")]
		TwitterApplicationOnlyAccount = 2,
		[Description("Cloud CMS 2 Legged OAuth")]
		CloudCMS2LeggedOAuth = 3
	}
}
