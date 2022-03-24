import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";
import {Issue} from "@octokit/webhooks-types";
import getGitHubRepoName from "../utils/gitHubUrlExtractor/gitHubURLExtractor";
// @ts-ignore
import csvToJson from 'csvjson-csv2json';
import {Button, Input} from '@equinor/eds-core-react'
import {IssueCard} from "../components/issueCard";
import {openOnGitHub} from "../utils/openOnGitHub";


const Home: NextPage = () => {
    const [repoUrl, setRepoUrl] = useState('')
    const [organization, setOrganization] = useState('')
    const [repo, setRepo] = useState('')
    const [repoUrlError, setRepoUrlError] = useState('')
    const [newIssues, setNewIssues] = useState<Issue[]>([])

    useEffect(() => {
        if (!repoUrl) return;
        setRepoUrlError('')
        try {
            const {organization, repository} = getGitHubRepoName(repoUrl)
            setOrganization(organization);
            setRepo(repository);
        } catch (e) {
            if (e instanceof Error) {
                setRepoUrlError(e.message)
            }
        }
    }, [repoUrl])

    function handleFileChosen(file: File | undefined) {
        if (!file) return;
        const reader = new FileReader();
        //we expect a csv file
        if (file.type !== 'text/csv') {
            alert('Please select a csv file');
            return;
        }

        reader.readAsText(file);

        reader.onload = function () {
            const csv = reader.result as string;
            const json: { [key: string]: any }[] = csvToJson(csv);
            // setIssues(json);
            const parsed = json.map(jiraIssue => {
                // find all keys with "__" in them
                const keys = Object.keys(jiraIssue).filter(key => key.includes('__'))

                let commentKeys = keys.filter(key => key.includes('Comment'))
                //Combine all Comments__* into one
                let comments: string[] = []
                commentKeys.forEach(commentKey => {
                    if (!!jiraIssue[commentKey].trim()) {
                        comments.push(jiraIssue[commentKey])
                    }
                })

                let attachmentKeys = keys.filter(key => key.includes('Attachment'))
                //Combine all Attachment__* into one
                let attachments: string[] = []
                attachmentKeys.forEach(attachmentKey => {
                    if (!!jiraIssue[attachmentKey].trim()) {
                        attachments.push(jiraIssue[attachmentKey])
                    }
                })

                return {
                    title: `${jiraIssue['Issue key']} - ${jiraIssue.Summary}`,
                    body: `${jiraIssue.Description}\n                    
${"```"}\n
Key: ${jiraIssue['Issue key']}
${jiraIssue.Type ? `Type: ${jiraIssue.Type}` : ''}
${jiraIssue.Assignee ? `Assignee: ${jiraIssue.Assignee}` : ''}
${attachments.length ? `Attachments:\n\n${attachments.map((i, index) => {
                        const isLast = index === attachments.length - 1
                        if (isLast) return ` - ${i}`
                        return ' - ' + i + '\n\n';
                    }).join('')}` : ''}
${comments.length ? `Comments:\n\n${comments.map((i, index) => {
                        const isLast = index === comments.length - 1
                        if (isLast) return ` - ${i}`
                        return ' - ' + i + '\n\n';
                    }).join('')}` : ''}
${"```"}
`,
                } as Issue;
            })
            setNewIssues(parsed);
        }
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>Issue importer</title>
                <meta name="description" content="JIRA CSV to GitHub Issues"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    {`Jira -> GitHub`}
                </h1>

                <p className={styles.description}>
                    This tool will help you convert issues from a Jira CSV file into GitHub Issues.
                </p>

                <div>
                    <h2>
                        Please enter the GitHub repository URL
                    </h2>
                    <Input type="text" placeholder="Repository link" value={repoUrl} onChange={(e) => {
                        setRepoUrl(e.target.value)
                    }}/>
                    {repoUrlError ?
                        <p style={{
                            color: 'red',
                            fontWeight: 'bold'
                        }}>{repoUrlError}</p>
                        :
                        <div style={{display: 'flex', gap: 24}}>
                            <div>
                                <h3>Organization</h3>
                                {organization ? <p>{organization}</p> : <p>Not provided</p>}
                            </div>
                            <div>
                                <h3>Repository</h3>
                                {repo ? <p>{repo}</p> : <p>Not provided</p>}
                            </div>
                        </div>
                    }

                    {!organization || !repo ?
                        <></>
                        :
                        <>
                            <h2>
                                Drop your CSV file here
                            </h2>

                            <Input type="file" accept=".csv" onChange={e => handleFileChosen(e.target.files?.[0])}/>

                            <div>
                                <div style={{display: 'flex', justifyItems: 'center'}}>

                                    <Button
                                        disabled={!repoUrl || !newIssues.length}
                                        onClick={() => {
                                            newIssues.forEach(issue => {
                                                openOnGitHub(organization, repo, issue);
                                            });
                                        }}
                                    >
                                        Open issue creator on GitHub for each issue
                                    </Button>
                                    {newIssues.length > 0 && <p>{newIssues.length} issues will be imported</p>}
                                </div>
                                <hr/>
                                <div style={{
                                    display: 'flex', flexWrap: "wrap", gap: 12
                                }}>
                                    {newIssues.map(issue => {
                                        return <IssueCard
                                            key={issue.title}
                                            issue={issue}
                                            organization={organization}
                                            repo={repo}
                                        />
                                    })}
                                </div>
                            </div>
                        </>
                    }
                </div>
            </main>
        </div>
    )
}

export default Home
