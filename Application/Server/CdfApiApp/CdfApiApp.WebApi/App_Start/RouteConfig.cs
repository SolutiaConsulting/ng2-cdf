using System.Web.Mvc;
using System.Web.Routing;

namespace CdfApiApp.WebApi
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