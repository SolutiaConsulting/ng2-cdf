using StructureMap.Configuration.DSL;
using StructureMap.Graph;

namespace CdfApp.Common
{
	public class CommonRegistry : Registry
	{
		public CommonRegistry()
		{
			Scan(x =>
			{
				x.TheCallingAssembly();
				x.Convention<DefaultConventionScanner>();
			});
		}
	}
}
