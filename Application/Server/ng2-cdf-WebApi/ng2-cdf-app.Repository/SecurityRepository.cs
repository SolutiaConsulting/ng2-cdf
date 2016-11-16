using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using MobilePatronsApp.DataContracts.Implementations;
using MobilePatronsApp.DataContracts.Interfaces;
using Microsoft.Data.Extensions;

namespace MobilePatronsApp.Repository
{
	public static class SecurityRepository
	{
		public static IUserModel CreateNewUser(IRegistrationModel dataModel)
		{
			IUserModel userModel;

			using (var connection = new SqlConnection(Database.ConnectionString))
			{
				connection.Open();

				using (var command = new SqlCommand("Security.CreateNewUser"))
				{
					command.Connection = connection;
					command.CommandType = CommandType.StoredProcedure;

					var sqlParams = new List<SqlParameter>
					{
						new SqlParameter("@AuthenticationTypeId", dataModel.AuthenticationTypeId),
						new SqlParameter("@FirstName", dataModel.FirstName),
						new SqlParameter("@LastName", dataModel.LastName),
						new SqlParameter("@EmailAddress", dataModel.EmailAddress),
						new SqlParameter("@UserId", dataModel.UserId),
						new SqlParameter("@HashedPassword", dataModel.HashedPassword),
						new SqlParameter("@PasswordSalt", dataModel.PasswordSalt),
						new SqlParameter("@IsTemporaryPassword", dataModel.IsTemporaryPassword)
					};

					command.Parameters.AddRange(sqlParams.ToArray());

					using (DbDataReader reader = command.ExecuteReader())
					{
						// 1.) RESULT SET: TENANT META DATA
						userModel = reader.Materialize<UserModel>().FirstOrDefault() ?? new UserModel();
					}
				}
			}

			return userModel;
		}

		public static IUserModel RegisteredUserByUserId(ILoginModel loginModel)
		{
			IUserModel userModel;

			using (var connection = new SqlConnection(Database.ConnectionString))
			{
				connection.Open();

				using (var command = new SqlCommand("Security.RegisteredUserByUserId"))
				{
					command.Connection = connection;
					command.CommandType = CommandType.StoredProcedure;

					var sqlParams = new List<SqlParameter>
					{
						new SqlParameter("@UserId", loginModel.UserName)
					};

					command.Parameters.AddRange(sqlParams.ToArray());

					using (DbDataReader reader = command.ExecuteReader())
					{
						// 1.) RESULT SET: TENANT META DATA
						userModel = reader.Materialize<UserModel>().FirstOrDefault() ?? new UserModel();
					}
				}
			}

			return userModel;
		}	

		public static IUserModel RegisteredUserByGlobalId(String globalId)
		{
			IUserModel userModel;

			using (var connection = new SqlConnection(Database.ConnectionString))
			{
				connection.Open();

				using (var command = new SqlCommand("Security.RegisteredUserByGlobalId"))
				{
					command.Connection = connection;
					command.CommandType = CommandType.StoredProcedure;

					var sqlParams = new List<SqlParameter>
					{
						new SqlParameter("@GlobalId", globalId)
					};

					command.Parameters.AddRange(sqlParams.ToArray());

					using (DbDataReader reader = command.ExecuteReader())
					{
						// 1.) RESULT SET: TENANT META DATA
						userModel = reader.Materialize<UserModel>().FirstOrDefault() ?? new UserModel();
					}
				}
			}

			return userModel;
		}
	}
}
