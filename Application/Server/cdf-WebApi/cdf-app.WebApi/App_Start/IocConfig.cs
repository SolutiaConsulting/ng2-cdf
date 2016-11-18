using System.Web.Http;
using System.Web.Mvc;
using CdfApp.WebApi.DependencyResolution;

namespace CdfApp.WebApi
{
	public class IocConfig
	{
		public static void Register()
		{
			var container = IoC.Initialize();
			DependencyResolver.SetResolver(new StructureMapDependencyResolver(container));
			GlobalConfiguration.Configuration.DependencyResolver = new StructureMapDependencyResolver(container);
		}
	}
}