using CdfApiApp.BusinessLibrary.API;
using CdfApiApp.Common.Enums;
using CdfApiApp.DataContracts.API;
using CdfApiApp.DataContracts.Implementations;
using Google.Apis.Auth.OAuth2;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace CdfApiApp.WebApi.Controllers
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


		private readonly ApplicationApiDomainCredentialBusinessLibrary applicationApiDomainCredentialBusinessLibrary;

	    public GoogleController
		(
			ApplicationApiDomainCredentialBusinessLibrary applicationApiDomainCredentialBusinessLibrary
		)
	    {
		    this.applicationApiDomainCredentialBusinessLibrary = applicationApiDomainCredentialBusinessLibrary;
	    }


		/// <summary>
		/// TWITTER AUTHENTICATE
		/// </summary>
		/// <returns></returns>
		[Route("generate-token")]
		[ResponseType(typeof(String))]
		public HttpResponseMessage PostGenerateToken(GoogleAuthenticationRequestModel requestModel)
		{
			//var encodedCredentials = "V3RReEk1Q1pqZloxeHVFdFlNNkhoRmlzUjp5RU85NThFd2N2WExDems5U1h0Y0Zqbms0QUxOTmtWUmFLYzFDSmtMZ2I0SGFQSHVsMw==";

			if (ModelState.IsValid)
			{
				try
				{
					var parametersDataContract = new ApplicationApiDomainCredentialParametersDataContract
					{
						ApplicationKey = requestModel.ApplicationKey,
						ApiDomainId = (int) ApiDomainEnum.Google
					};

					var dataContract = applicationApiDomainCredentialBusinessLibrary.GetDataContract(parametersDataContract);
					
					GoogleCredential credential;

					using (var stream = GenerateStreamFromString(dataContract.CredentialTypeValue))
					{
						credential = GoogleCredential.FromStream(stream);
					}

					credential = credential.CreateScoped
					(
						requestModel.ScopeList
					);

					//credential = credential.CreateScoped						
					//(
					//	new[] 
					//	{ 
					//		"https://www.googleapis.com/auth/youtube" 
					//	}
					//);

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
			var stream = new MemoryStream();
			var writer = new StreamWriter(stream);
			writer.Write(s);
			writer.Flush();
			stream.Position = 0;
			return stream;
		}
    }
}
