---
title: 'Whitepaper'
section: 2.5
---

# VVallet.me: A Decentralized Proof of Identity System

- Bruce MacDonald
- hi@bmacd.xyz
- www.vvallet.me/im/bruce

### Abstract

VVallet.me is a directory that maps social media identities to a cryptocurrency wallet. Through ownership of a secret key (stored in a cryptocurrency wallet) that allows adding transactions to a blockchain an owner can demonstrate that they control many separate accounts. This proof of ownership can be done in a trust-less decentralized manner through the process of "bidirectional linking". First a key holder registers their ownership of that keypair on-chain through creating an alias. Next, an account holder adds a public message to one of their distributed accounts that asserts their vvallet.me alias. The account holder then uses the private key of their keypair to sign a transaction which contains a link to this vvallet.me assertion and adds it on-chain. Through adding both of these identity assertions the account holder has created a proven link between their alias and social media identity.

# Introduction

As user's web presence grows and they use more separate online services their digital identity grows increasingly distributed. Someone may have the username `Alice1234` on Twitter while their blog can be found at `funny-cats.com`. How can the owner of both of these separate online profiles prove that they are in-fact in control of both?

This paper proposes a process of bidirectional linking which allows an account holder to prove they are in possession of two completely separate online accounts using their cryptocurrency wallet. By using a cryptocurrency wallet the user can create a link between their centralized “Web2” and decentralized “Web3'' identities. This simplifies the transition from centralized web applications to decentralized applications. It also positions vvallet.me as a trusted authority on decentralized identity that users can rely on as an identity source for any decentralized application. The goal of vvallet.me is to be a convenient mechanism to prove ownership of digital identity across different applications.

# Bidirectional Proof of Ownership

Bidirectional proof of ownership allows creating a link between two separate accounts in a trustless way by publicly showing that the owner has access to secrets that only the holder of both accounts would have access to. This process is bidirectional in the fact that the proof of ownership across the separate platforms points to corresponding proof on the other account. This form of proof is trustless because the assertion of account ownership on both accounts can be verified to be true by any party that wishes to do so. All the proof needed for verification is publically visible and decentralized.

This process is more easily understandable with a real world example. Picture a scenario where someone needed to prove that the car parked outside their house belonged to them while they weren't physically present. They could leave a note behind the windshield of their car claiming ownership of a home, but there would be no way to tell if that home actually belonged to them. The same problem of one-way proof would also exist if the owner left a note claiming ownership of some car behind a window in their house. The only way for this person to prove they own both the car and the house without being physically present would be to put a note behind the windshield of the car that indicated which house belonged to them, with a corresponding note behind the window of their home verifying that their car is the one in question.

# Decentralized Storage

The decentralized and trust-less storage mechanism of the vvallet.me identity verification process is a blockchain. In order to add a transaction onto a blockchain a user must sign a transaction to prove they have the authorization to make the change on-chain. The keypair that a user holds to show authorization is (almost always) stored in a cryptocurrency wallet. The vvallet.me application relies on the convenience of a cryptocurrency wallet as a user interface to make key pair management easy for users.

# Identity Proofs on vvallet.me

## 1. Registering a Keypair

The first step of using vvallet.me is to register ownership of a keypair. This is done by submitting a request to register a new vvallet.me alias. This alias allows for a keypair to have a persistent identity which can be used across any application that connects to a cryptocurrency wallet. The vvallet.me alias is unique and does not expire until it is released by the owner.

## 2. Adding a proof of Account Ownership to VVallet.me

Once a keypair is registered with an alias on vvallet.me the user may now begin linking to this alias across their distributed online identities as a place to connect their different profiles. Linking a social media identity involves two steps, making a public post as proof and adding that proof on-chain.

### 2a. Making a Public Post

To show that a user owns a social media profile they must make a public post that contains a link to their vvallet.me alias.

### 2b. Adding the Proof Post On-Chain

With a publically accessible proof post the user can show they are also in possession of the cryptocurrency wallet by using vvallet.me to sign a transaction which is added on-chain if the signature is valid.

## 3. Retrieving and Validating a Proof

The final step of validating account ownership falls on clients. They must retrieve proofs associated with an alias from the blockchain and validate they reference the alias in question.

### 3a. Retrieving Proofs

To retrieve a proof a client can look up all vvallet.me proofs on-chain that have been added by the public key associated with a given alias. This can be done easily using the vvallet.me web client by navigating to `vvallet.me/im/${alias}` in a web browser.

### 3b. Validating Proofs

It is assured that the owner of a proof is the alias linked to the keypair that added it on-chain, but it must be validated that the alias linked in the public social media post is the one that is expected. The alias linked in the public post must match the alias the client looked up or the proof is invalid. This validation is handled automatically and displayed for the user in the vvallet.me web application.

# Use Cases

## Trustless Proof of Online Identity Ownership

VVallet.me serves as a simple mechanism to link all your online social media accounts in one place if you choose to do so. It allows anyone looking to connect or follow you on different platforms to easily find all the components of your online presence. It also links these accounts in a trustless manner that shows without a doubt that the same owner is in control of all these accounts, rather than trusting a third-party service through a traditional cross-application account protocol such as OAuth.

## Simple Cryptocurrency Payments

The process of sending a cryptocurrency payment to someone's wallet address (their public key) is prone to error as it may involve manually entering a long random string that represents the recipient's address. One solution to this problem has been through naming services such as the Ethereum Name Service which convert an address such as `vitalik.eth` to a wallet address. The advantages of vvallet.me in comparison to these name services are that a user's vvallet.me alias does not expire unless it is released by the owner, and that it also assures the payer that they are sending the funds to who they believe they are.

## Decentralized Identity Authority

VVallet.me works as a decentralized identity authority that a user can leverage to prove who they are across any application. When a user connects their cryptocurrency wallet to more decentralized applications (dApps) their vvallet.me identity will also expand. dApps can add support for vvallet.me to their applications to provide users with an alias automatically that they can use to engage with the dApp. dApps can also make requests through vvallet.me to access verified information about the user, and the user can choose which information they wish to share with the dApp.

## A Web2 to Web3 Identity Bridge

People already have an established online identity on traditional centralized web service. As more users look to migrate to Web3 they may look to bridge their current profiles to their new ones. Rather than manually re-entering all their personal information repeatedly across their new decentralized profiles they can leverage vvallet.me to automatically provide this information to decentralized applications once the user grants them access.
