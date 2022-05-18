### First Local Deployment

```
# Compile the program
anchor build

# Run a local ledger
solana-test-validator

# Deploy the program
anchor deploy
...
Program Id: 5EwrjHSsAiQjLmepCocQCEXuCe2wUZVjTaWM4jAim3Fo

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