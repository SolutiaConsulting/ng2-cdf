﻿using System.Web.Http;

namespace CdfApp.WebApi
{
	public static class WebApiConfig
	{
		public static void Register(HttpConfiguration config)
		{
			// Web API routes
			config.MapHttpAttributeRoutes();
		}
	}
}