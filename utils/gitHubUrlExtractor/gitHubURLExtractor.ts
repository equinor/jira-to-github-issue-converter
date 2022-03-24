// get the organization and repository name from a GitHub url
export default function getGitHubRepoName(url: string): { organization: string, repository: string } {
    const splitted = url
        .split('/')
        .filter(e => {
            if (e === '') return false;
            if (e === 'github.com') return false;
            if (e === 'www') return false;
            if (e === 'https:') return false;
            return e !== 'http:';
        })

    const organization = splitted[0];
    const repository = splitted[1];
    if (!organization || !repository) throw new Error('Invalid GitHub URL');
    return {organization, repository};
}