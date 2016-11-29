using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Google.Apis.Auth.OAuth2;

namespace CdfApp.WebApi.Controllers
{
    /// <summary>
    /// TWITTER CONTROLLER
    /// </summary>
	[RoutePrefix("api/google")]
	public class GoogleController : BaseApiController
    {
		private const int ERROR_MODEL_STATE = 0;
		private const int ERROR_AUTHENTICATION = 1;
		private const int ERROR_REQUEST = 2;
		private const int ERROR_TWITTER_API_APPLICATION_ONLY = 3;

		readonly Dictionary<int, Tuple<String, String>> errors = new Dictionary<int, Tuple<String, String>>
        {
			{ ERROR_MODEL_STATE, new Tuple<string, string>("Invlaid Data", "The provided inputs were invalid.  Please provide the correct inputs.") },
			{ ERROR_AUTHENTICATION, new Tuple<string, string>("Authentication Error", "An error happened while attempting to authenticate.") },
			{ ERROR_REQUEST, new Tuple<string, string>("Request Error", "An error happened while attempting to make a request.") },
			{ ERROR_TWITTER_API_APPLICATION_ONLY, new Tuple<string, string>("Request Error", "With Application-only authentication you don’t have the context of an authenticated user and this means that any request to API for endpoints that require user context, such as posting tweets, will not work.") }
        };


		/// <summary>
		/// TWITTER AUTHENTICATE
		/// </summary>
		/// <returns></returns>
		[Route("generate-token")]
		[ResponseType(typeof(String))]
		public HttpResponseMessage PostGenerateToken()
		{
			//var encodedCredentials = "V3RReEk1Q1pqZloxeHVFdFlNNkhoRmlzUjp5RU85NThFd2N2WExDems5U1h0Y0Zqbms0QUxOTmtWUmFLYzFDSmtMZ2I0SGFQSHVsMw==";

			if (ModelState.IsValid)
			{
				try
				{
					

					var jsonString = 
"{"+
  "'type': 'service_account',"+
  "'project_id': 'dfw-sportsbeat',"+
  "'private_key_id': '5059d645aba16b929c3fa0e5fc005641f1f2a926',"+
  "'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVqqcHK+tS1CcZ\n7+/KFtg8bFolg8tC8suHaZ/CqSYOsqayNuRS750m5FoEOuNVlGWe2wFXTMPsTw9m\nUoZElvSvIjUMrthmdg6vT+4lwUjFag/Zu+68d0NzcnhlPLon79zZSuPw7aex0bGs\nLtdy6IQ1ImCpyOGN3SyMA+sWipu8bGCZOEwR+TqNh2PG7xjjlzDvJ0iwJYwG9lYF\nufe2EEKltD1cxaH15Y36u2hObK5QQR/5VvlJM1NNBCX2VwQL9Svtb5MoL/e8Rnv3\nOLcwLdsddNeai/67/y3LZyTKXu+x1Ug/g7EwXebb1L6kFRlFoEsfRlswR5xgt/FR\nszn0etsvAgMBAAECggEAex3ZHr3E3DZYzY4+6oCdWrvIeeNmRQ5oDn/jSaRzxHZW\nrUwJ5mwhbp6X6+YOxmo63/0r2aTnJAwuQHR+35joJt4cGVHKacfPEF+LRwAHsZE6\nzuiGWNyT5jroetUyIv8Ij8CidVpLjZ/Zs/BNvu2R+Jf1gP+6UCdImulLFfMKZ9gw\nsLay/OEIcrn8XlCUX5vXF1r4VZHDGN7+H3sQ5Oltv2WAnmxBaxjFR7EwR1HNjTKM\nAiBQU3H4OB3g8A1dJ9TX5ia2EPQnaiAXQUOj6uj4m1GOSMWfxIkpP3urRN/npd+H\n+JM6n7YLlZKeKkOE/BaxXBEg/kZDNxua9n6kFeIKYQKBgQD9XmgAXKP+kVFU24Zd\nWJP8/uYak7Y4QgeRLiBMqmRpkjMM2xPfzDDdDxitvI+JVKi/zCC4tKunoHnQBtiN\nuTHqHNtNp44zl77M0IF/nGj544JsSP+K4tZg0OYasR0AmteetGp/dbhgwXVamHGd\nvr+rnERmiCkqLO68bn/Qr+3n8QKBgQDX4rIr3OVQyQFpNWrJ7VJnyK18SMUJtbhA\nUhkEqLGjvvsZLGMBp15/r/Szvx0q2MNvbo2/UUktF/ftNkzFEzVdd4LM21CR9Hgq\nCLLNevAZl8FeQMHjgZEbEdTio/bIqRRqAH26L7slsWPHVw74ebwig10WR0cFyb3K\nQgzaufUVHwKBgQCtNdP9o1eNmcSzMVw7BmotRAkE1ER3U1SfAJyeLMJ2lbcGq+J7\nVbl19nMVmtm5tcGjVSZtfz32W7PK7lMvGBMyjEW0Yb7KMIwEsupE1iXB57Hq20Cv\nrwGFsGoOh1RfbHvJiGdh+ZVxt+/FXoAVqiiYZj0wpxcVOSCAez4v6YXH0QKBgQDT\nsgf3PShdHI5WpbvvANoizUVZr14QFHL2F8tSpz1yjY9a8wyvDXl8CoYRUKIAZwjW\nF3nGFqaEIpHKucl0I07cNZo82f7a8Ph4d4kmN5yD7C0BCM1YE7C/869nA1O3Fx3e\niFbBoZaJ8rYePj9+5pjW2ywH8aMyiM6kLDrArUMoDwKBgCmxeli55FxfXmnf5q2S\nwhBE5F4VVKDsRTNScogBK+WWGg0eqVJ27ELdfE9VE/tzlwW4xSizfInMx003/A/4\nKrzzImjZ/J0LTcgj84ARtkQqQwek9UhdFe4M16QasRUuXy9CdUUK6A4d79/5B42N\njgNatUVJRY/zd8EDRJkz0DUK\n-----END PRIVATE KEY-----\n',"+
  "'client_email': 'dfw-sportsbeat@dfw-sportsbeat.iam.gserviceaccount.com',"+
  "'client_id': '115647775425755439649',"+
  "'auth_uri': 'https://accounts.google.com/o/oauth2/auth',"+
  "'token_uri': 'https://accounts.google.com/o/oauth2/token',"+
  "'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',"+
  "'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/dfw-sportsbeat%40dfw-sportsbeat.iam.gserviceaccount.com'"+
"}";


					GoogleCredential credential;

					using (var stream = GenerateStreamFromString(jsonString))
					{
						credential = GoogleCredential.FromStream(stream);
					}

					credential = credential.CreateScoped						
					(
						new[] 
						{ 
							"https://www.googleapis.com/auth/youtube" 
						}
					);

					var task = ((ITokenAccess)credential).GetAccessTokenForRequestAsync("https://accounts.google.com/o/oauth2/auth");
					task.Wait();

					var accessToken = task.Result;

					return Request.CreateResponse(HttpStatusCode.OK, accessToken);
				}
				catch (Exception ex)
				{
					throw ThrowIfError(ERROR_AUTHENTICATION, HttpStatusCode.BadRequest, errors, ex.Message);
				}
			}

			throw ThrowIfError(ERROR_MODEL_STATE, HttpStatusCode.BadRequest, errors, ModelState);
		}

		private static Stream GenerateStreamFromString(string s)
		{
			MemoryStream stream = new MemoryStream();
			StreamWriter writer = new StreamWriter(stream);
			writer.Write(s);
			writer.Flush();
			stream.Position = 0;
			return stream;
		}
    }
}
