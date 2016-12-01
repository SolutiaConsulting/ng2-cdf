using System.IO;
using System.Net;
using System.Web.Script.Serialization;

namespace CdfApiApp.WebApi.Helpers
{
	/// <summary>
	/// WEB REQUEST HELPER
	/// </summary>
	public static class WebRequestHelper
	{
		/// <summary>
		/// CONVERT WEB REQUEST INTO A TYPE
		/// </summary>
		/// <typeparam name="T">TARGET TYPE</typeparam>
		/// <param name="webRequest">WEB REQUEST</param>
		/// <returns></returns>
		public static T GetResponseStreamReader<T>(WebRequest webRequest) where T : new()
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