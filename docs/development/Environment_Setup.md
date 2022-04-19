# Environment Setup

The following tools are required to build and run vvallet locally. The installation steps may have changed since the time of this document's creation.

## Rust

### Install

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Configuration

```
# Add to PATH (if not added on install)
export PATH="$HOME/.cargo/bin:$PATH"
```

## Solana

### Install

```
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

### Configuration

```
# if no address set
solana-keygen new

# local solana development rather than mainnet
solana config set --url localhost
```

## Anchor

### Install

```
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

## Yarn

### Install

```
# using homebrew on Mac, npm also available
brew install yarn
```
