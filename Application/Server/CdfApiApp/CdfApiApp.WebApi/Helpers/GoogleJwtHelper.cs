using CdfApiApp.WebApi.Models;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace CdfApiApp.WebApi.Helpers
{
	/// <summary>
	/// GOOGLE JWT (JSON WEB TOKEN) HELPER
	/// </summary>
	public static class GoogleJwtHelper
	{
		public static async Task<string> GenerateJwt(GoogleAuthOptions authOptions)
		{
			string jwt = CreateJwt(authOptions);

			var dic = new Dictionary<string, string>
			{
				{ "grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer" },
				{ "assertion", jwt }
			};

			var content = new FormUrlEncodedContent(dic);

			var httpClient = new HttpClient { BaseAddress = new Uri("https://accounts.google.com") };
			var response = await httpClient.PostAsync("/o/oauth2/token", content);
			response.EnsureSuccessStatusCode();

			dynamic dyn = await response.Content.ReadAsAsync<dynamic>();
			return dyn.access_token;
		}

		private static readonly DateTime UnixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);

		private static string CreateJwt(GoogleAuthOptions authOptions)
		{
			/* changed */
			const X509KeyStorageFlags certificateFlags = X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.PersistKeySet | X509KeyStorageFlags.Exportable;

			var certificate = new X509Certificate2(Convert.FromBase64String(authOptions.CertificateKey), authOptions.CertificateSecret, certificateFlags);
			/* end of change */

			DateTime now = DateTime.UtcNow;
			var claimset = new
			{
				iss = authOptions.Issuer,
				scope = "https://www.googleapis.com/auth/plus.me",
				aud = authOptions.Audience,
				iat = ((int)now.Subtract(UnixEpoch).TotalSeconds).ToString(CultureInfo.InvariantCulture),
				exp = ((int)now.AddMinutes(55).Subtract(UnixEpoch).TotalSeconds).ToString(CultureInfo.InvariantCulture)
			};

			// header
			var header = new { typ = "JWT", alg = "RS256" };

			// encoded header
			var headerSerialized = JsonConvert.SerializeObject(header);
			var headerBytes = Encoding.UTF8.GetBytes(headerSerialized);
			var headerEncoded = TextEncodings.Base64Url.Encode(headerBytes);

			// encoded claimset
			var claimsetSerialized = JsonConvert.SerializeObject(claimset);
			var claimsetBytes = Encoding.UTF8.GetBytes(claimsetSerialized);
			var claimsetEncoded = TextEncodings.Base64Url.Encode(claimsetBytes);

			// input
			var input = String.Join(".", headerEncoded, claimsetEncoded);
			var inputBytes = Encoding.UTF8.GetBytes(input);

			// signiture
			var rsa = (RSACryptoServiceProvider)certificate.PrivateKey;
			var cspParam = new CspParameters
			{
				KeyContainerName = rsa.CspKeyContainerInfo.KeyContainerName,
				/* changed */
				KeyNumber = (int)KeyNumber.Exchange,
				Flags = CspProviderFlags.UseMachineKeyStore
				/* end of change */
			};
			var cryptoServiceProvider = new RSACryptoServiceProvider(cspParam) { PersistKeyInCsp = false };
			var signatureBytes = cryptoServiceProvider.SignData(inputBytes, "SHA256");
			var signatureEncoded = TextEncodings.Base64Url.Encode(signatureBytes);

			// jwt
			return String.Join(".", headerEncoded, claimsetEncoded, signatureEncoded);
		}
	}
}