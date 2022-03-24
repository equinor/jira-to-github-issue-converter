import {Issue} from "@octokit/webhooks-types";
import newGithubIssueUrl from "new-github-issue-url";

export function openOnGitHub(organization: string, repo: string, issue: Issue) {
    const url = newGithubIssueUrl({
        user: organization,
        repo: repo,
        title: issue.title,
        body: issue.body || undefined,
    });
    //open url in new tab
    window.open(url, '_blank');
}