export type SubmissionDetails = {
    author: string,
    selftext: string
}

export type ChildData = {
    data: SubmissionDetails
}

export type SubmissionChildren = {
    children: ChildData[]
}

export type RedditSubmission = {
    data: SubmissionChildren
}