using System;
using System.Web;
using System.Web.Routing;

namespace CdfApiApp.WebApi.Helpers
{
	public class GuidConstraint : IRouteConstraint
	{
		public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
		{
			if (values.ContainsKey(parameterName))
			{
				var stringValue = values[parameterName] as string;

				if (!string.IsNullOrEmpty(stringValue))
				{
					Guid guidValue;

					return Guid.TryParse(stringValue, out guidValue) && (guidValue != Guid.Empty);
				}
			}

			return false;
		}
	}

	public class StringConstraint : IRouteConstraint
	{
		public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
		{
			if (values.ContainsKey(parameterName))
			{
				var paramString = values[parameterName].ToString();
				Int32 intValue;
				if (Int32.TryParse(paramString, out intValue))
				{
					return false;
				}

				return (values[parameterName] is String);
			}

			return false;
		}
	}

	public class LongConstraint : IRouteConstraint
	{
		public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
		{
			if (values.ContainsKey(parameterName))
			{
				long longValue;
				return long.TryParse(values[parameterName].ToString(), out longValue) && (longValue != long.MinValue) && (longValue != long.MaxValue);
			}

			return false;
		}
	}

	public class IntConstraint : IRouteConstraint
	{
		public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
		{
			if (values.ContainsKey(parameterName))
			{
				int intValue;
				return int.TryParse(values[parameterName].ToString(), out intValue) && (intValue != int.MinValue) && (intValue != int.MaxValue);
			}

			return false;
		}
	}

	public class Int32Constraint : IRouteConstraint
	{
		public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
		{
			if (values.ContainsKey(parameterName))
			{
				int intValue;
				return int.TryParse(values[parameterName].ToString(), out intValue) && (intValue != int.MinValue) && (intValue != int.MaxValue);
			}

			return false;
		}
	}

	public class Int64Constraint : IRouteConstraint
	{
		public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
		{
			if (values.ContainsKey(parameterName))
			{
				long intValue;
				return long.TryParse(values[parameterName].ToString(), out intValue) && (intValue != long.MinValue) && (intValue != long.MaxValue);
			}

			return false;
		}
	}

	public class DecimalConstraint : IRouteConstraint
	{
		public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
		{
			if (values.ContainsKey(parameterName))
			{
				decimal decimalValue;
				return decimal.TryParse(values[parameterName].ToString(), out decimalValue) && (decimalValue != decimal.MinValue) && (decimalValue != decimal.MaxValue);
			}

			return false;
		}
	}

	public class BitConstraint : IRouteConstraint
	{
		public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
		{
			if (values.ContainsKey(parameterName))
			{
				bool bitValue;
				return bool.TryParse(values[parameterName].ToString(), out bitValue);
			}

			return false;
		}
	}

}