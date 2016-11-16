using System.Web.Mvc;
using System.Web.Routing;

namespace Ng2CdfApp.WebApi
{
	public class RouteConfig
	{
		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
			routes.MapMvcAttributeRoutes();
		}
	}
}