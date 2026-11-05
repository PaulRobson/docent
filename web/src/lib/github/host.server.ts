export const DEFAULT_HOST = 'github.com';

// The GitHub host Docent works against: gh's own GH_HOST, which gh's calls
// already follow, or github.com. As a bare, lower-case name, so that
// "https://GitHub.com/" is github.com too.
export const githubHost = () =>
	process.env.GH_HOST?.trim()
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/\/+$/, '') || DEFAULT_HOST;
