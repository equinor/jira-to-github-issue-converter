import getGitHubRepoName from "./gitHubURLExtractor";

it('should extract the organization and repository name from a github url', () => {
    expect(getGitHubRepoName('https://github.com/equinor/MAD-VSM-WEB/issues/175')).toEqual({
        organization: 'equinor',
        repository: 'MAD-VSM-WEB'
    });
    expect(getGitHubRepoName('https://github.com/equinor/MAD-VSM-WEB')).toEqual({
        organization: 'equinor',
        repository: 'MAD-VSM-WEB'
    });
    expect(getGitHubRepoName('https://github.com/equinor/MAD-VSM-WEB/somethingToIgnore')).toEqual({
        organization: 'equinor',
        repository: 'MAD-VSM-WEB'
    });
    expect(getGitHubRepoName('equinor/MAD-VSM-WEB')).toEqual({
        organization: 'equinor',
        repository: 'MAD-VSM-WEB'
    });
});

