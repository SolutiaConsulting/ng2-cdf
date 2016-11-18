using StructureMap.Configuration.DSL;
using StructureMap.Graph;

namespace CdfApp.Repository
{
	public class RepositoryRegistry : Registry
	{
		public RepositoryRegistry()
		{
			Scan(x =>
			{
				x.TheCallingAssembly();
				x.Convention<DefaultConventionScanner>();
			});
		}
	}
}
