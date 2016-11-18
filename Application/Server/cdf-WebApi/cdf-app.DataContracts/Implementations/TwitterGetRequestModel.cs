using System;

namespace CdfApp.DataContracts.Interfaces
{
	public class TwitterGetRequestModel : ITwitterGetRequestModel
	{
		public String BearerToken { get; set; }
		public String UrlFragment { get; set; }

		public Boolean IsValid()
		{
			var isValid = !String.IsNullOrEmpty(BearerToken) && !String.IsNullOrEmpty(UrlFragment);

			return isValid;
		}
	}
}
