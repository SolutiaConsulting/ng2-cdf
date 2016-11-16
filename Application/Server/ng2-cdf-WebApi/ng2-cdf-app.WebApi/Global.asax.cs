using System;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Ng2CdfApp.WebApi
{
	public class WebApiApplication : HttpApplication
	{
		protected void Application_BeginRequest()
		{
			//NOTE: Stopping IE from being a caching whore
			HttpContext.Current.Response.Cache.SetAllowResponseInBrowserHistory(false);
			HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);
			HttpContext.Current.Response.Cache.SetNoStore();
			Response.Cache.SetExpires(DateTime.Now);
			Response.Cache.SetValidUntilExpires(true);
		}

		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();

			//APPLICATION CONFIGURATIONS
			IocConfig.Register();
			WebApiConfig.Register(GlobalConfiguration.Configuration);
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			MessageHandlerConfig.RegisterMessageHandler(GlobalConfiguration.Configuration);

			//RouteDebug.RouteDebugger.RewriteRoutesForTesting(RouteTable.Routes);

			//REMOVES XML AS THE DEFAULT RESPONSE TYPE IN LIEU OF JSON
			GlobalConfiguration.Configuration.Formatters.Clear();
			GlobalConfiguration.Configuration.Formatters.Add(new JsonMediaTypeFormatter());

			DataAnnotationsModelValidatorProvider.AddImplicitRequiredAttributeForValueTypes = false;

			GlobalConfiguration.Configuration.EnsureInitialized(); 
		}

		protected void Application_Error()
		{
			var exception = Server.GetLastError();
			HttpContext.Current.Application.Lock();
			HttpContext.Current.Application["TheException"] = exception;
			HttpContext.Current.Application.UnLock();
		}
	}
}