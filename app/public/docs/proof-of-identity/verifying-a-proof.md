---
title: 'Verifying a Proof'
section: 3.1
---

The process of validating account ownership falls on clients. The client must retrieve proofs associated with an alias from the blockchain and validate they reference the alias in question. This process is automatically handled when viewing a profile on the vvallet.me web portal.

1. Retrieving a proof for validation
To retrieve a proof a client can look up all vvallet.me proofs on-chain that have been added by the public key associated with a given alias. This can be done easily using the vvallet.me web client by navigating to `vvallet.me/im/${alias}` in a web browser.

2. Validating a proof
It is assured that the owner of a proof is the alias linked to the keypair that added it on-chain, but it must be validated that the alias linked in the public social media post is the one that is expected. The alias linked in the public post must match the alias the client looked up or the proof is invalid. This validation is handled automatically and displayed for the user in the vvallet.me web application.
