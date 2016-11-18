using StructureMap.Configuration.DSL;
using StructureMap.Graph;

namespace CdfApp.BusinessLibrary
{
	public class BusinessLibraryRegistry : Registry
	{
		public BusinessLibraryRegistry()
		{
			Scan(x =>
			{
				x.TheCallingAssembly();
				x.Convention<DefaultConventionScanner>();
			});
		}
	}
}
