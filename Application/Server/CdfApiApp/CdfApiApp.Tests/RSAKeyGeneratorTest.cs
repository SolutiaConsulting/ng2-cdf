using System.Security.Cryptography;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PopsApp.WebApi.Tests
{
	[TestClass]
	public class RSAKeyGeneratorTest
	{
		[TestMethod]
		public void TestRSAKey()
		{
			var rsa = new RSACryptoServiceProvider(2048);
			var privateKey = rsa.ToXmlString(true);
			var publicKey = rsa.ToXmlString(false);

			Assert.IsNotNull(privateKey);
			Assert.IsNotNull(publicKey);
		}
	}
}
