using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;

namespace CdfApiApp.WebApi.Helpers
{
	public static class MyHttpRequestMessageExtensions
	{
		public static HttpResponseMessage CreateResponseWithETag<T>(this HttpRequestMessage request, HttpStatusCode statusCode, T value)
		{
			var eTagHash = ToEtagHash(value);
			var response = request.CreateResponse(HttpStatusCode.OK, value);
			response.Headers.ETag = new EntityTagHeaderValue(String.Concat("\"", eTagHash, "\""), true);
			return response;
		}


		private static string ToEtagHash(object responseObject)
		{
			var byteArray = ObjectToByteArray(responseObject);
			var md5csp = new MD5CryptoServiceProvider();
			var hashByteArray = md5csp.ComputeHash(byteArray);
			var hash = BitConverter.ToString(hashByteArray).Replace("-", string.Empty);

			return hash;
		}

		// Convert an object to a byte array
		private static byte[] ObjectToByteArray(Object obj)
		{
			BinaryFormatter bf = new BinaryFormatter();

			using (var ms = new MemoryStream())
			{
				bf.Serialize(ms, obj);
				return ms.ToArray();
			}
		}
	}
}