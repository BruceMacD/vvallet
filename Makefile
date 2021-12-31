default: build

.PHONY: certs

build:
	docker build -t vvallet .

certs:
	openssl genrsa -out certs/server.key 2048
	openssl req -new -x509 -sha256 -key certs/server.key -out certs/server.crt -days 3650
	openssl req -new -sha256 -key certs/server.key -out certs/server.csr
	openssl x509 -req -sha256 -in certs/server.csr -signkey certs/server.key -out certs/server.crt -days 3650

proto:
	@protoc \
		--proto_path=./internal/v1 \
		--validate_out="lang=go:./internal/v1" --validate_opt paths=source_relative \
		--go_out ./internal/v1 --go_opt paths=source_relative \
		--go-grpc_out ./internal/v1 --go-grpc_opt paths=source_relative \
		--grpc-gateway_out ./internal/v1 --grpc-gateway_opt logtostderr=true --grpc-gateway_opt paths=source_relative --grpc-gateway_opt generate_unbound_methods=true \
		--grpc-gateway-ts_out=./internal/v1/ui \
		./internal/v1/*.proto

lint:
	staticcheck ./...

test:
	go test ./...

dependencies:
	go get ./...

dev: build
	docker-compose up
