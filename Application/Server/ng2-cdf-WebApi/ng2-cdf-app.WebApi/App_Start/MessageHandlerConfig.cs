using System.Web.Http;
using Ng2CdfApp.WebApi.Handlers;
using StructureMap;

namespace Ng2CdfApp.WebApi
{
	/// <summary>
	/// HANDLES X-AUTHENTICATION
	/// </summary>
	public class MessageHandlerConfig
	{
		/// <summary>
		/// CONFIGURES VARIOUS HANDLERS TO FIRE PRE-REQUEST
		/// </summary>
		/// <param name="config"></param>
		public static void RegisterMessageHandler(HttpConfiguration config)
		{
			/* HANDLE CORS AND PRE-FLIGHT REQUESTS*/
			var corsHandler = ObjectFactory.GetInstance<CorsHandler>();
			config.MessageHandlers.Add(corsHandler);
		}
	}
}