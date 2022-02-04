import { IdentityAlias } from "types/identityAlias"
import { Tweet } from "types/tweet"

const TWEET_REGEX = '(Verifying my @vvalletdotme alias is )(.*)(: )'
const TWEET_GROUPS = 4

export const validateTweet = async (tweet: Tweet, expectedOwner: IdentityAlias): Promise<boolean> => {
    const groups = tweet.text.match(TWEET_REGEX)

    if (groups !== null && groups.length === TWEET_GROUPS) {
        const claimedAlias = groups[2]
        
        if (claimedAlias === expectedOwner.alias) {
            return true
        }
    }
    return false
}