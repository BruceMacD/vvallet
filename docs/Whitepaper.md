# vvallet.me: A Decentralized Proof of Identity System

Bruce MacDonald
hi@bmacd.xyz
www.vvallet.me

**Abstract.** Through ownership of a secret key that allows adding transactions to a blockchain an owner can demonstrate that they control many separate accounts. This proof of ownership can be done in a trust-less decentralized manner through the process of "bidirectional linking". First a key holder registers their ownership of that keypair on chain through creating an alias. Next, an account holder adds a public message to one of their distributed accounts that asserts their vvallet.me alias. The account holder then uses the private key of their keypair to sign a transaction which contains a link to this vvallet.me assertion and adds it on chain. Through adding both of these identity assertions the account holder has created a proven link between their identities.

# Introduction

As user's web presence grows and they use more separate online services their digital identity grows increasingly distributed. Someone may have the username `Alice1234` on Twitter while their blog can be found at `funny-cats.com`. How can the owner of both of these separate online profiles prove that they are in-fact in control of both?

This paper proposes a process of bidirectional linking which allows an account holder to prove they are in pocession of two completely separate online accounts using their cryptocurrency wallet. By using a cryptocurrency wallet the user can create a link between their centralized “Web2” and decentralized “Web3” identities. This simplifies the transition from centralized web applications to decentealized applications. It also positions vvallet.me as a trusted authority on decentralized identity that users can rely on as an identity source for any decentralized application. It also means vvallet.me is a convinient mechanism to prove components of their identity across different applications. 

# Bidirectional Proof of Ownership

Bidirectional proof of ownership allows creating a link between two separate accounts in a trustless way by publically showing that the owner has access to secrets that only the holder of both accounts would have access to. This process is bidirectional in the fact that the proof of ownership accross the separate platforms points to corresponding proof on the other account. This form of proof is trustless because the assertion of account ownership on both accounts can be verified to be true by any party that wishes to do so. All the proof is publically visible.

This process is more easily understandable with a real world example. Picture a scenario where someone needed to prove that the car parked outside their house belonged to them while they weren't physically present. They could leave a note behind the windshield of their car claiming ownership of a home, but there would be no way to tell if that home actually belonged to them. The same problem of one-way proof would also exist it the left a note claiming ownership of some car behind a window in their house. The only way for this person to prove they own both the car and the house without being physically present would be to put a note behind the windshild of the car that indicated which house belonged to them, with a corresponding note behind the window of their home verifying that their car is the one in question.

![proof of identity visual steps](./Proof%20of%20Identity%20Through%20Bidirectional%20Linking.png)

# Decentralized Storage

The decentralized and trust-less storage mechanism of the vvallet.me identity verification process is a blockchain. In order to add a transaction onto a blockchain a user must sign a transaction to prove they have the authorization to make the change on-chain. The keypair that a user holds to show authorization is (almost always) stored in a cryptocurrency wallet. The vvallet.me application relies on the convinience of a cryptocurency wallet as a user interface to make keypir management easy for users. 

# Identity Proofs on vvallet.me
## 1. Registering a Keypair
The first step of using vvallet.me is to register ownership of a keypair. This is done by submitting a request to register a new vvallet.me alias. This alias allows for a keypair to have a persistent identity which can be used accross any application that connects to cryptocurrency wallet. The vvallet.me alias is unique and does not expire until it is released by the owner.


## 2. Adding a vvallet.me Assertion to an Account
Once a keypair is registered with an alias on vvallet.me the user may now begin linking to this alias accross their distributed online identities as a place to connect their different profiles.



## 3. Adding an Assertion Proof On-Chain



## 4. Retrieving and Validating a Proof



# Use Cases







