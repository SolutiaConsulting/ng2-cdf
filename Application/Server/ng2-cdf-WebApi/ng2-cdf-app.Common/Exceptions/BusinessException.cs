using System;

namespace CdfApp.Common.Exceptions
{
	public class BusinessException : Exception
	{
		public String ErrorMessage;

		public override string Message
		{
			get
			{
				return ErrorMessage;
			}
		}

		public BusinessException()
		{

		}

		public BusinessException(string errorMessage)
		{
			ErrorMessage = errorMessage;
		}
	}
}
