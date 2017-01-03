using CdfApiApp.BusinessLibrary.API;
using CdfApiApp.Common.Enums;
using CdfApiApp.DataContracts.API;
using CdfApiApp.DataContracts.Implementations;
using CdfApiApp.DataContracts.Implementations.AuthenticationRequestModels;
using CdfApiApp.DataContracts.Interfaces;
using CdfApiApp.WebApi.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace CdfApiApp.WebApi.Controllers
{
    /// <summary>
    /// TWITTER CONTROLLER
    /// </summary>
	[RoutePrefix("api/cloudcms")]
	public class CloudCMSController : BaseApiController
    {
		private const int ERROR_MODEL_STATE = 0;
		private const int ERROR_AUTHENTICATION = 1;
		private const int ERROR_REQUEST = 2;
		private const int ERROR_MISSING_KEY_AND_OR_SECRET = 3;

		readonly Dictionary<int, Tuple<String, String>> errors = new Dictionary<int, Tuple<String, String>>
        {
			{ ERROR_MODEL_STATE, new Tuple<string, string>("Invlaid Data", "The provided inputs were invalid.  Please provide the correct inputs.") },
			{ ERROR_AUTHENTICATION, new Tuple<string, string>("Authentication Error", "An error happened while attempting to authenticate.") },
			{ ERROR_REQUEST, new Tuple<string, string>("Request Error", "An error happened while attempting to make a request.") },
			{ ERROR_MISSING_KEY_AND_OR_SECRET, new Tuple<string, string>("Authenticatin Error", "Application making request does not have proper credentials needed to generate an access token.  Please save proper credentials from API Domain in CdfTokenStore database.  Each API Domain has it's own set of credentials and how it generates access-tokens.") }
        };


		private readonly ApplicationApiDomainCredentialBusinessLibrary applicationApiDomainCredentialBusinessLibrary;

		public CloudCMSController
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
		[ResponseType(typeof(IAuthenticationDataContract))]
		public HttpResponseMessage PostGenerateToken(AuthenticationRequestCloudCmsModel requestModel)
		{
			if (ModelState.IsValid)
			{
				try
				{
					var parametersDataContract = new ApplicationApiDomainCredentialParametersDataContract
					{
						ApplicationKey = requestModel.ApplicationKey,
						ApiDomainId = (int) ApiDomainEnum.CloudCMS,
						CredentialTypeId = (int)CredentialTypeEnum.CloudCMS2LeggedOAuth
					};

					//STEP 0: RETRIEVE DOMAIN CREDENTIAL INFORMATION FROM DATA STORE FOR PASSED APPLICATION KEY
					var dataContract = applicationApiDomainCredentialBusinessLibrary.GetDataContract(parametersDataContract);

					//STEP 1: RETRIEVE JSON CONTAINING AUTHENTICATION DATA FOR GENERATING ACCESS TOKENS...
					dynamic stuff = JsonConvert.DeserializeObject(dataContract.CredentialTypeValue);


					//PULL NEEDED DATA FROM STUFF...
					String clientKey = stuff.clientKey;
					String clientSecret = stuff.clientSecret;
					String username = stuff.username;
					String password = stuff.password;


					//MAKE SURE WE HAVE KEY & SECRET...
					if (String.IsNullOrEmpty(clientKey) 
						|| String.IsNullOrEmpty(clientSecret)
						|| String.IsNullOrEmpty(username)
						|| String.IsNullOrEmpty(password))
					{
						throw ThrowIfError(ERROR_MISSING_KEY_AND_OR_SECRET, HttpStatusCode.BadRequest, errors);
					}

					//STEP 2: BASE 64 ENCODE KEY AND SECRET INTO BEARER TOKEN TO BE USED TO REQUEST ACCESS TOKEN
					var bearerTokenEncoded = AccessTokenHelper.GenerateAccessToken(clientKey, clientSecret);


					//STEP 3: TRADE IN BEARER TOKEN FOR ACCESS TOKEN...
					var webRequestUrl = String.Format("https://api.cloudcms.com/oauth/token?grant_type=password&scope=api&username={0}&password={1}", username, System.Web.HttpUtility.UrlEncode(password));
					var webRequest = WebRequest.Create(webRequestUrl);
					webRequest.Method = "POST";
					webRequest.ContentType = "application/x-www-form-urlencoded";
					webRequest.Headers.Add("Authorization", String.Format("Basic {0}", bearerTokenEncoded));
					

					//STEP 4: CONVERT WEB REQUEST INTO IAuthenticationDataContract...
					var authenticationDataContract = WebRequestHelper.GetResponseStreamReader<AuthenticationDataContract>(webRequest);


					return Request.CreateResponse(HttpStatusCode.OK, authenticationDataContract);
				}
				catch (Exception ex)
				{
					var errorMessage = "";

					if (ex.InnerException != null && !String.IsNullOrEmpty(ex.InnerException.Message))
					{
						errorMessage = ex.InnerException.Message;
					}
					else
					{
						errorMessage = ex.Message;
					}

					throw ThrowIfError(ERROR_AUTHENTICATION, HttpStatusCode.BadRequest, errors, errorMessage);
				}
			}

			throw ThrowIfError(ERROR_MODEL_STATE, HttpStatusCode.BadRequest, errors, ModelState);
		}
    }
}
