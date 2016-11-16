using System;
using System.Collections.Generic;
using System.IO;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Script.Serialization;
using Ng2CdfApp.DataContracts.Implementations;
using Ng2CdfApp.DataContracts.Interfaces;

namespace Ng2CdfApp.WebApi.Controllers
{
    /// <summary>
    /// TWITTER CONTROLLER
    /// </summary>
	[RoutePrefix("api/twitter")]
	public class TwitterController : BaseApiController
    {
		private const int ERROR_MODEL_STATE = 0;
		private const int ERROR_AUTHENTICATION = 1;
		private const int ERROR_REQUEST = 2;	

		readonly Dictionary<int, Tuple<String, String>> errors = new Dictionary<int, Tuple<String, String>>
        {
			{ ERROR_MODEL_STATE, new Tuple<string, string>("Invlaid Data", "The provided inputs were invalid.  Please provide the correct inputs.") },
			{ ERROR_AUTHENTICATION, new Tuple<string, string>("Authentication Error", "An error happened while attempting to authenticate.") },
			{ ERROR_REQUEST, new Tuple<string, string>("Request Error", "An error happened while attempting to make a request.") }
        };


		/// <summary>
		/// TWITTER AUTHENTICATE
		/// </summary>
		/// <returns></returns>
		[Route("authenticate")]
		[ResponseType(typeof(IAuthenticationDataContract))]
		public HttpResponseMessage PostAuthenticate(TwitterAuthenticationRequestModel requestModel)
		{
			//var encodedCredentials = "V3RReEk1Q1pqZloxeHVFdFlNNkhoRmlzUjp5RU85NThFd2N2WExDems5U1h0Y0Zqbms0QUxOTmtWUmFLYzFDSmtMZ2I0SGFQSHVsMw==";

			if (ModelState.IsValid)
			{
				try
				{
					const string body = "grant_type=client_credentials";
					var bodyData = Encoding.ASCII.GetBytes(body);
					var webRequest = WebRequest.Create("https://api.twitter.com/oauth2/token");
					webRequest.Method = "POST";
					webRequest.ContentType = "application/x-www-form-urlencoded";
					webRequest.Headers.Add("Authorization", String.Format("Basic {0}", requestModel.EncodedCredentials));
					webRequest.ContentLength = bodyData.Length;

					//ADD BODY DATA TO REQUEST
					var newStream = webRequest.GetRequestStream();
					newStream.Write(bodyData, 0, bodyData.Length);
					newStream.Close();

					var authenticationDataContract = GetResponseStreamReader<AuthenticationDataContract>(webRequest);

					return Request.CreateResponse(HttpStatusCode.OK, authenticationDataContract);
				}
				catch (Exception ex)
				{
					throw ThrowIfError(ERROR_AUTHENTICATION, HttpStatusCode.BadRequest, errors, ex.Message);
				}
			}

			throw ThrowIfError(ERROR_MODEL_STATE, HttpStatusCode.BadRequest, errors, ModelState);
		}


		/// <summary>
		/// TWITTER GET
		/// </summary>
		/// <returns></returns>
		[Route("request")]
		[ResponseType(typeof(String))]
		public HttpResponseMessage PostRequest(TwitterRequestModel requestModel)
		{
			//var bearerToken = "AAAAAAAAAAAAAAAAAAAAANHPxwAAAAAAm2T5L94EvS%2FrTQ1L5dWwwBQpWUI%3Dxn9u4d1vw9gqCjdyncJr6TN6bcvUHe5DK6n7IFFmIy1S0TpWkF";
			//var urlFragment = "statuses/user_timeline.json?count=10&screen_name=dfwsportsbeat";

			if (ModelState.IsValid)
			{
				try
				{
					var webRequest = GenerateWebRequest(requestModel.UrlFragment, requestModel.BearerToken);
					var response = GetResponseStreamReader<object>(webRequest);

					return Request.CreateResponse(HttpStatusCode.OK, response);
				}
				catch (Exception ex)
				{
					throw ThrowIfError(ERROR_REQUEST, HttpStatusCode.BadRequest, errors, ex.Message);
				}
			}

			throw ThrowIfError(ERROR_MODEL_STATE, HttpStatusCode.BadRequest, errors, ModelState);
		}





		private static WebRequest GenerateWebRequest(string urlFragment, string bearerToken)
		{
			var baseUrl = "https://api.twitter.com/1.1/";
			var url = String.Format("{0}/{1}", baseUrl, urlFragment);

			var request = WebRequest.Create(url);
			request.Method = "GET";
			request.ContentType = "application/json";
			request.Headers.Add("authorization", String.Format("Bearer {0}", bearerToken));
			return request;
		}

		private static T GetResponseStreamReader<T>(WebRequest webRequest) where T : new()
		{
			dynamic response = new T();
			var javaScriptSerializer = new JavaScriptSerializer();

			using (var stream = webRequest.GetResponse().GetResponseStream())
			{
				if (stream != null)
				{
					using (var streamReader = new StreamReader(stream))
					{
						response = (T)javaScriptSerializer.Deserialize(streamReader.ReadToEnd(), typeof(T)); ;
					}
				}
			}

			return response;
		}
    }
}
