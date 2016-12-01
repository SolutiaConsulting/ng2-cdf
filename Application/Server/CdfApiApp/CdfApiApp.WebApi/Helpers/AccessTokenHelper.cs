using System;
using System.Text;

namespace CdfApiApp.WebApi.Helpers
{
	/// <summary>
	/// ACCESS TOKEN HELPER
	/// </summary>
	public static class AccessTokenHelper
	{
		/// <summary>
		/// BASE 64 ENCODE KEY AND SECRET INTO BEARER TOKEN TO BE USED TO REQUEST ACCESS TOKEN
		/// </summary>
		/// <param name="key">EXAMPLE: xvz1evFS4wEEPTGEFPHBog</param>
		/// <param name="secret">EXAMPLE: L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg</param>
		/// <returns></returns>
		public static String GenerateAccessToken(String key, String secret)
		{
			//var encodedConsumerKey = System.Web.HttpUtility.UrlEncode(key);
			//var encodedConsumerSecret = System.Web.HttpUtility.UrlEncode(secret);
			var bearerToken = String.Format("{0}:{1}", key, secret);
			var bearerTokenEncoded = AccessTokenHelper.Base64Encode(bearerToken);

			return bearerTokenEncoded;
		}


		private static string Base64Encode(string plainText)
		{
			var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
			return Convert.ToBase64String(plainTextBytes);
		}
	}
}