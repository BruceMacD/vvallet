# Environment Setup

This document outlines the requirements to run the vvallet service locally for development.

## Requirements
- Go 1.16+
- [Protoc version 3](https://grpc.io/docs/protoc-installation/)
- [gRPC gateway](github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway)
- [Staticcheck for Go linting](https://staticcheck.io/docs/getting-started/)
- PostgreSQL (to remotely access the database container)
    - Install the uuid-ossp module: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
- Docker