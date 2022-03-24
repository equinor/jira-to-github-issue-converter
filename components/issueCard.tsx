import {Issue} from "@octokit/webhooks-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {openOnGitHub} from "../utils/openOnGitHub";
import {Button} from "@equinor/eds-core-react";

export function IssueCard(props: { issue: Issue, organization: string, repo: string }) {
    const {issue, organization, repo} = props;

    return (
        <div style={{
            maxWidth: "800px",
            // width: 785,
            width: '100%',
            // height: 200,
            border: '1px solid',
            borderRadius: 6,
            overflow: 'scroll',
            padding: 12
        }}
             key={issue.title}
        >
            <h3>{issue.title}</h3>
            {issue.body &&
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{issue.body}</ReactMarkdown>}
            <Button
                onClick={() => openOnGitHub(organization, repo, issue)}
            >
                Open on GitHub
            </Button>
        </div>
    );
}