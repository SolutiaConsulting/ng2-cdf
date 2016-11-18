using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace CdfApp.WebApi.Controllers
{
	/// <summary>
	/// 
	/// </summary>
	public class BaseApiController : ApiController
	{
		/// <summary>
		/// BASE CONTROLLER
		/// </summary>
		public BaseApiController()
		{
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="validationError"></param>
		/// <param name="errorDetail"></param>
		/// <returns></returns>
		protected HttpResponseException ForbidWithMessage(string validationError, string errorDetail)
		{
			return ThrowIfError(-1, HttpStatusCode.Forbidden, new Dictionary<int, string> { { -1, validationError } }, errorDetail);
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="error"></param>
		/// <param name="statusCode"></param>
		/// <param name="errors"></param>
		/// <returns></returns>
		protected HttpResponseException ThrowIfError(int? error, HttpStatusCode statusCode, Dictionary<int, string> errors)
		{
			return ThrowIfError(Request, error, statusCode, errors, String.Empty);
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="error"></param>
		/// <param name="statusCode"></param>
		/// <param name="errors"></param>
		/// <param name="modelState"></param>
		/// <returns></returns>
		protected HttpResponseException ThrowIfError(int? error, HttpStatusCode statusCode, Dictionary<int, string> errors, ModelStateDictionary modelState)
		{
			var errorDetail = string.Join(",", ModelState.Keys.ToList());
			var message = String.Format("Errors in: {0}", errorDetail);

			return ThrowIfError(Request, error, statusCode, errors, message);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="error"></param>
		/// <param name="statusCode"></param>
		/// <param name="errors"></param>
		/// <param name="modelState"></param>
		/// <returns></returns>
		protected HttpResponseException ThrowIfError(int? error, HttpStatusCode statusCode, Dictionary<int, Tuple<String, String>> errors, ModelStateDictionary modelState)
		{
			var errorName = errors[error.Value].Item1;
			var errorDetail = string.Join(",", ModelState.Keys.ToList());
			var message = String.Format("Errors in: {0}", errorDetail);

			return ThrowIfError(Request, error, statusCode, errorName, message);
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="error"></param>
		/// <param name="statusCode"></param>
		/// <param name="errors"></param>
		/// <param name="errorDetail"></param>
		/// <returns></returns>
		protected HttpResponseException ThrowIfError(int? error, HttpStatusCode statusCode, Dictionary<int, string> errors, string errorDetail)
		{
			return ThrowIfError(Request, error, statusCode, errors, errorDetail);
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="error"></param>
		/// <param name="statusCode"></param>
		/// <param name="errors"></param>
		/// <returns></returns>
		protected HttpResponseException ThrowIfError(int? error, HttpStatusCode statusCode, Dictionary<int, Tuple<String, String>> errors)
		{
			var errorName = errors[error.Value].Item1;
			var errorDetail = errors[error.Value].Item2;

			return ThrowIfError(Request, error, statusCode, errorName, errorDetail);
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="error"></param>
		/// <param name="statusCode"></param>
		/// <param name="errors"></param>
		/// <returns></returns>
		protected HttpResponseException ThrowIfError(int? error, HttpStatusCode statusCode, Dictionary<int, Tuple<String, String>> errors, string errorMessage)
		{
			var errorName = errors[error.Value].Item1;
			var errorDetail = String.Format("{0} - {1}", errors[error.Value].Item2, errorMessage);

			return ThrowIfError(Request, error, statusCode, errorName, errorDetail);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="request"></param>
		/// <param name="error"></param>
		/// <param name="statusCode"></param>
		/// <param name="errors"></param>
		/// <param name="errorDetail"></param>
		/// <returns></returns>
		protected HttpResponseException ThrowIfError(HttpRequestMessage request, int? error, HttpStatusCode statusCode, Dictionary<int, string> errors, string errorDetail)
		{
			return ThrowIfError(request, error, statusCode, errors[error.Value], errorDetail);
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="request"></param>
		/// <param name="errorCode"></param>
		/// <param name="statusCode"></param>
		/// <param name="error"></param>
		/// <param name="errorDetail"></param>
		/// <returns></returns>
		public static HttpResponseException ThrowIfError(HttpRequestMessage request, int? errorCode, HttpStatusCode statusCode, string error, string errorDetail)
		{
			return new HttpResponseException(request.CreateErrorResponse(statusCode, new HttpError
				{
					{ "ErrorCode", errorCode.GetValueOrDefault() }, 
					{ "ErrorTitle", error },
					{ "ErrorDetail", errorDetail }
				}));
		}
	}
}