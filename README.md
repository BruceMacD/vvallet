# vvallet
A web3 enabled proof of identity system.

# Running Locally
Install dependencies: `go get ./...`

Create TLS certificates: `make certs`

Then either run locally: `go run main.go`

or start a development deployment in Docker: `make dev`

Then test the API is accessible using cURL: `curl -X POST -k http://localhost:4443/v1/register -d '{"alias": "test", "key": { "alg": "RSA256", "serial": "1234"}}'`

## Contributing
[Setup your development environment](./docs/environment_setup.md)
