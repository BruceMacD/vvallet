// Migrations are an early feature at the time of writing. 
// Currently, they're nothing more than this single deploy script.
// This is invoked from the CLI, injecting a provider configured from the workspace's Anchor.toml.

const anchor = require("@project-serum/anchor");

module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);

  // Add your deploy script here.
}
