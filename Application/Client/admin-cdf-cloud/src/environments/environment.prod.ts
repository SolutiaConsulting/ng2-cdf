// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment =
	{
		production: true,
		name: 'DFW SportsBeat',
		version: '1.0.0',
		JW_PLAYER:
		{
			key: 'wNPiCrI15qDzPs7fkSNfvlMlvxwVXL5ZnCE7dg=='
		},
		CLOUD_CMS:
		{
			ROOT_URL: 'https://api.cloudcms.com',
			RepositoryId: '0fdddfe701d019e22471',
			BranchId: 'c27456c5add2b76e6f5a',
			MEDIA_URL: 'https://a022bcec-0c8d-4f5d-b4ad-338c24b49149-hosted.cloudcms.net/static/node',
			Content:
			{
				HomePage:
				{
					CacheKey: 'HomeMobilePage',
					NodeList: [ 'b660ecd5aa0bcf5de8dd' ]
				}
			}
		},
		Domain_Credentials:
		[
			{
				"Domain": "api.cloudcms.com",
				"ApplicationKey": "42d28aaf-0cef-4433-bb9b-0981fd06375a"
			},
			{
				"Domain": "api.twitter.com",
				"ApplicationKey": "42d28aaf-0cef-4433-bb9b-0981fd06375a"
			},
			{
				"Domain": "googleapis.com",
				"ApplicationKey": "42d28aaf-0cef-4433-bb9b-0981fd06375a",
				"ScopeList":
				[
					"https://www.googleapis.com/auth/youtube"
				]
			}
		]
	};
