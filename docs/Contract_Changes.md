# Contract Changes

## Updating the IDL

To update the IDL run `anchor run copy-idl`, this copies the current IDL to the app source.

In the future this may be updated to use `types` in the Anchor.toml but it doesn't copy the program ID at the time of writing, so that manual script is needed.