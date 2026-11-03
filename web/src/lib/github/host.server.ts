// The GitHub host Docent works against: gh's own GH_HOST, which gh's calls
// already follow, or github.com.
export const githubHost = () => process.env.GH_HOST?.trim() || 'github.com';
