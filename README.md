# vvallet

The vvallet dapp for storing and exploring identity proof assertions.

## Development Quickstart
[Start by following the environment setup in the docs.](./docs/Environment_Setup.md)

### First Local Deployment

```
# Compile the program
anchor build

# Run a local ledger
solana-test-validator

# Deploy the program
anchor deploy
...
Program Id: CKpJLxvCJkjR7rFngDQm5MXiq1exBvDvcj94usqFJkZ3

# set the programs.localnet property in Anchor.toml to the output program ID 
# set the declared_id in `programs/vvallet/src/lib.rs` to the output program ID 
```

### Local Deployment

```
# Build, deploy, and start solana-test-validator. Runs continuously.
anchor localnet
```

### Run Tests

```
# Build, deploy, start solana-test-validator, and run tests. Terminates after tests complete.
anchor test
```