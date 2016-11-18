using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Filters;
using CdfApp.Common.Exceptions;

namespace CdfApp.WebApi.Attributes
{
	public class ApiExceptionHandlingAttribute : ExceptionFilterAttribute
	{
		public override void OnException(HttpActionExecutedContext context)
		{
			if (context.Exception is BusinessException)
			{
				throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
				{
					Content = new StringContent(context.Exception.Message),
					ReasonPhrase = "Exception"
				});
			}

			var exceptionMessage = new StringContent("An error occurred, please try again or contact the administrator.");

			if (context.Exception != null && context.Exception.Message.Length > 0)
			{
				exceptionMessage = new StringContent(string.Format("An error occurred: {0}", context.Exception.Message));
			}

			throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
			{
				Content = exceptionMessage,
				ReasonPhrase = "Critical Exception"
			});
		}
	}
}