const TWEET_REGEX = '(Verifying my decentralized identity: vvallet\.me\/im\/)(.*)'
const TWEET_BODY = 'Verifying my decentralized identity: vvallet\.me\/im'
const TWEET_GROUPS = 3 // full match, group 1, and group 2

export const validateTweet = async (tweet: string): Promise<boolean> => {
    const groups = tweet.match(TWEET_REGEX)

    if (groups !== null && groups.length == TWEET_GROUPS) {
        if (groups[1] !== TWEET_BODY) {
            return false
        }
        const aliasKey = groups[2];
        // TODO: compare to owner claimed in proof
    }
    return false
}