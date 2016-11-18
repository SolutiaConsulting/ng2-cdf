using System;

namespace CdfApp.DataContracts.Interfaces
{
	public interface IBaseDataContract
	{
		Int32 Id { get; set; }
		String Name { get; set; }
	}
}
