import {Issue, Organization, User} from "@octokit/webhooks-types";
import {Octokit} from "octokit";


export const getUserData = async (accessToken: string) => {
    const octokit = new Octokit({
        auth: accessToken
    });
    const {
        data,
    } = await octokit.rest.users.getAuthenticated();
    return data as User;
}

export const getOrganizations = async (accessToken: string) => {
    const octokit = new Octokit({auth: accessToken});
    const {
        data,
    } = await octokit.rest.orgs.listForAuthenticatedUser({
        type: 'public',
    });
    return data as Organization[];
}
export const getRepositories = async (accessToken: string, organization: string) => {
    const octokit = new Octokit({auth: accessToken});
    if (organization) {
        const {
            data,
        } = await octokit.rest.repos.listForOrg({
            org: organization,
            per_page: 100,

        });
        return data as any[];
    }
    // if organization is not specified, get all repositories for the authenticated user
    const {
        data,
    } = await octokit.rest.repos.listForAuthenticatedUser();
    return data as any[];
}


export const addIssue = async (accessToken: string, organization: string, repository: string, issue: Issue) => {
    const octokit = new Octokit({auth: accessToken});
    const {
        data,
    } = await octokit.rest.issues.create({
        owner: organization,
        repo: repository,
        title: issue.title,
        body: issue.body ? issue.body : '',
        labels: issue.labels,
    });
    return data;
}

export const getIssues = async (accessToken: string, organization: string, repository: string) => {
    const octokit = new Octokit({auth: accessToken});
    // const {data} = await octokit.request(`GET /orgs/${organization}/repos/${repository}/issues`);
    // const {
    //     data,
    // } = await octokit.rest.issues.listForRepo({
    //     owner: organization,
    //     repo: repository,
    //     // per_page: 100,
    // });
    // get all issues for repo
    const {data} = await octokit.rest.issues.listForRepo({
        owner: organization,
        repo: repository,
        per_page: 100,
    });
    return data as Issue[];
}

export const searchIssues = async (accessToken: string, organization: string, repository: string, query: string, per_page: number = 100) => {
    const octokit = new Octokit({auth: accessToken});
    // const {data} = await octokit.request(`GET /orgs/${organization}/repos/${repository}/issues`);
    // const {
    //     data,
    // } = await octokit.rest.search.issuesAndPullRequests({
    //     q: query,
    //     sort: 'updated',
    //     order: 'desc',
    //     per_page: 100,
    // });
    const {data} = await octokit.rest.search.issuesAndPullRequests({
        q: query,
        sort: 'updated',
        order: 'desc',
        per_page
    });
    return data;
}
