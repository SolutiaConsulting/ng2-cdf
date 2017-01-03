using CdfApiApp.BusinessLibrary.API;
using CdfApiApp.Common.Enums;
using CdfApiApp.DataContracts.API;
using CdfApiApp.DataContracts.Implementations;
using CdfApiApp.DataContracts.Implementations.AuthenticationRequestModels;
using CdfApiApp.DataContracts.Implementations.Twitter;
using CdfApiApp.DataContracts.Interfaces;
using CdfApiApp.DataContracts.Interfaces.Twitter;
using CdfApiApp.WebApi.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Http.Description;

namespace CdfApiApp.WebApi.Controllers
{
    /// <summary>
    /// TWITTER CONTROLLER
    /// </summary>
	[RoutePrefix("api/twitter")]
	public class TwitterController : BaseApiController
    {
		private const string TWITTER_BASE_URL = "https://api.twitter.com/1.1";
		private const int ERROR_MODEL_STATE = 0;
		private const int ERROR_AUTHENTICATION = 1;
		private const int ERROR_REQUEST = 2;
		private const int ERROR_MISSING_KEY_AND_OR_SECRET = 3;
		private const int ERROR_TWITTER_API_APPLICATION_ONLY = 4;

		readonly Dictionary<int, Tuple<String, String>> errors = new Dictionary<int, Tuple<String, String>>
        {
			{ ERROR_MODEL_STATE, new Tuple<string, string>("Invlaid Data", "The provided inputs were invalid.  Please provide the correct inputs.") },
			{ ERROR_AUTHENTICATION, new Tuple<string, string>("Authentication Error", "An error happened while attempting to authenticate.") },
			{ ERROR_REQUEST, new Tuple<string, string>("Request Error", "An error happened while attempting to make a request.") },
			{ ERROR_MISSING_KEY_AND_OR_SECRET, new Tuple<string, string>("Authenticatin Error", "Application making request does not have proper credentials needed to generate an access token.  Please save proper credentials from API Domain in CdfTokenStore database.  Each API Domain has it's own set of credentials and how it generates access-tokens.") },
			{ ERROR_TWITTER_API_APPLICATION_ONLY, new Tuple<string, string>("Request Error", "With Application-only authentication you don’t have the context of an authenticated user and this means that any request to API for endpoints that require user context, such as posting tweets, will not work.") }
        };


		private readonly ApplicationApiDomainCredentialBusinessLibrary applicationApiDomainCredentialBusinessLibrary;

		public TwitterController
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
		public HttpResponseMessage PostGenerateToken(AuthenticationRequestTwitterModel requestModel)
		{
			if (ModelState.IsValid)
			{
				try
				{
					var parametersDataContract = new ApplicationApiDomainCredentialParametersDataContract
					{
						ApplicationKey = requestModel.ApplicationKey,
						ApiDomainId = (int)ApiDomainEnum.Twitter,
						CredentialTypeId = (int)CredentialTypeEnum.TwitterApplicationOnlyAccount
					};

					//STEP 0: RETRIEVE DOMAIN CREDENTIAL INFORMATION FROM DATA STORE FOR PASSED APPLICATION KEY
					var dataContract = applicationApiDomainCredentialBusinessLibrary.GetDataContract(parametersDataContract);

					//STEP 1: RETRIEVE JSON CONTAINING AUTHENTICATION DATA FOR GENERATING ACCESS TOKENS...
					dynamic stuff = JsonConvert.DeserializeObject(dataContract.CredentialTypeValue);


					//PULL NEEDED DATA FROM STUFF...
					String clientKey = stuff.ConsumerKey;
					String clientSecret = stuff.ConsumerSecret;


					//MAKE SURE WE HAVE KEY & SECRET...
					if (String.IsNullOrEmpty(clientKey) || String.IsNullOrEmpty(clientSecret))
					{
						throw ThrowIfError(ERROR_MISSING_KEY_AND_OR_SECRET, HttpStatusCode.BadRequest, errors);
					}


					//STEP 2: BASE 64 ENCODE KEY AND SECRET INTO BEARER TOKEN TO BE USED TO REQUEST ACCESS TOKEN
					var bearerTokenEncoded = AccessTokenHelper.GenerateAccessToken(clientKey, clientSecret);


					//STEP 3: TRADE IN BEARER TOKEN FOR ACCESS TOKEN...
					const string body = "grant_type=client_credentials";
					var bodyData = Encoding.ASCII.GetBytes(body);
					var webRequest = WebRequest.Create("https://api.twitter.com/oauth2/token");
					webRequest.Method = "POST";
					webRequest.ContentType = "application/x-www-form-urlencoded";
					webRequest.Headers.Add("Authorization", String.Format("Basic {0}", bearerTokenEncoded));
					webRequest.ContentLength = bodyData.Length;


					//STEP 3: ADD BODY DATA TO REQUEST
					var newStream = webRequest.GetRequestStream();
					newStream.Write(bodyData, 0, bodyData.Length);
					newStream.Close();


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


		/// <summary>
		/// TWITTER GET
		/// </summary>
		/// <returns></returns>
		[Route("get/{id}")]
		[ResponseType(typeof(String))]
		public HttpResponseMessage GetRequest(string id)
		{
			//var bearerToken = "AAAAAAAAAAAAAAAAAAAAANHPxwAAAAAAm2T5L94EvS%2FrTQ1L5dWwwBQpWUI%3Dxn9u4d1vw9gqCjdyncJr6TN6bcvUHe5DK6n7IFFmIy1S0TpWkF";
			//var urlFragment = "statuses/user_timeline.json?count=10&screen_name=dfwsportsbeat";

			IEnumerable<string> bearerTokenValues = Request.Headers.GetValues("BearerToken");
			IEnumerable<string> urlFragmentValues = Request.Headers.GetValues("UrlFragment");
			
			var requestModel = new TwitterGetRequestModel
			{
				BearerToken = bearerTokenValues.FirstOrDefault(),
				UrlFragment = urlFragmentValues.FirstOrDefault()
			};

			if (requestModel.IsValid())
			{
				//IF BEARER TOKEN IS MISSING, THEN BOOT
				if (String.IsNullOrEmpty(requestModel.BearerToken))
				{
					throw new HttpResponseException(HttpStatusCode.Unauthorized);
				}

				try
				{
					var webRequest = GenerateGetWebRequest(requestModel);
					var response = WebRequestHelper.GetResponseStreamReader<object>(webRequest);

					return Request.CreateResponseWithETag(HttpStatusCode.OK, response);
				}
				catch (WebException ex)
				{
					var errorIndex = ex.Message.IndexOf("401", StringComparison.Ordinal);
					var is401Error = (errorIndex > -1);

					if (is401Error)
					{
						throw new HttpResponseException(HttpStatusCode.Unauthorized);
					}
					else
					{
						throw ThrowIfError(ERROR_REQUEST, HttpStatusCode.BadRequest, errors, ex.Message);
					}					
				}
				catch (Exception ex)
				{
					throw ThrowIfError(ERROR_REQUEST, HttpStatusCode.BadRequest, errors, ex.Message);
				}
			}

			throw ThrowIfError(ERROR_MODEL_STATE, HttpStatusCode.BadRequest, errors);
		}


		/// <summary>
		/// TWITTER POST
		/// </summary>
		/// <returns></returns>
		[Route("post")]
		[ResponseType(typeof(String))]
		public HttpResponseMessage PostRequest(TwitterPostRequestModel requestModel)
		{
			//var bearerToken = "AAAAAAAAAAAAAAAAAAAAANHPxwAAAAAAm2T5L94EvS%2FrTQ1L5dWwwBQpWUI%3Dxn9u4d1vw9gqCjdyncJr6TN6bcvUHe5DK6n7IFFmIy1S0TpWkF";
			//var urlFragment = "statuses/user_timeline.json?count=10&screen_name=dfwsportsbeat";

			if (ModelState.IsValid)
			{
				//IF BEARER TOKEN IS MISSING, THEN BOOT
				if (String.IsNullOrEmpty(requestModel.BearerToken))
				{
					throw new HttpResponseException(HttpStatusCode.Unauthorized);
				}

				try
				{
					var webRequest = GeneratePostWebRequest(requestModel);
					var response = WebRequestHelper.GetResponseStreamReader<object>(webRequest);

					return Request.CreateResponse(HttpStatusCode.OK, response);
				}
				catch (WebException ex)
				{
					var errorIndex = ex.Message.IndexOf("401", StringComparison.Ordinal);
					var is401Error = (errorIndex > -1);

					if (is401Error)
					{
						throw new HttpResponseException(HttpStatusCode.Unauthorized);
					}

					throw ThrowIfError(ERROR_TWITTER_API_APPLICATION_ONLY, HttpStatusCode.BadRequest, errors, ex.Message);
				}
				catch (Exception ex)
				{
					throw ThrowIfError(ERROR_REQUEST, HttpStatusCode.BadRequest, errors, ex.Message);
				}
			}

			throw ThrowIfError(ERROR_MODEL_STATE, HttpStatusCode.BadRequest, errors, ModelState);
		}




		private static WebRequest GenerateGetWebRequest(ITwitterGetRequestModel requestModel)
		{
			var url = String.Format("{0}/{1}", TWITTER_BASE_URL, requestModel.UrlFragment);

			var webRequest = WebRequest.Create(url);
			webRequest.Method = "GET";
			webRequest.ContentType = "application/json";
			webRequest.Headers.Add("authorization", String.Format("Bearer {0}", requestModel.BearerToken));

			return webRequest;
		}

		private static WebRequest GeneratePostWebRequest(ITwitterPostRequestModel requestModel)
		{
			var url = String.Format("{0}/{1}", TWITTER_BASE_URL, requestModel.UrlFragment);
			
			var webRequest = WebRequest.Create(url);
			webRequest.Method = "POST";
			webRequest.ContentType = "application/json";
			webRequest.Headers.Add("authorization", String.Format("Bearer {0}", requestModel.BearerToken));
			
			//ADD BODY DATA TO REQUEST
			if (!String.IsNullOrEmpty(requestModel.PostBody))
			{
				var postBodyData = Encoding.ASCII.GetBytes(requestModel.PostBody);
				
				webRequest.ContentLength = postBodyData.Length;

				var newStream = webRequest.GetRequestStream();
				newStream.Write(postBodyData, 0, postBodyData.Length);
				newStream.Close();
			}

			return webRequest;
		}
    }
}
