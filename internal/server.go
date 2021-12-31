package internal

import (
	"context"
	"crypto/tls"
	"fmt"
	"net/http"
	"os"
	"strings"

	v1 "github.com/BruceMacD/vvallet/internal/v1"
	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_validator "github.com/grpc-ecosystem/go-grpc-middleware/validator"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/rs/zerolog/log"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

const (
	serverCertFile = "certs/server.crt"
	serverKeyFile  = "certs/server.key"
)

// server routes requests and queries the DB
type server struct {
	v1.UnimplementedVValletServiceServer
	Storage *Storage
	ApiKey  string // presented by the profile service to prove authorization
}

func NewServer(dsn string) (*server, error) {
	s := &server{}

	store, err := NewStorage(dsn)
	if err != nil {
		return nil, fmt.Errorf("new server storage: %w", err)
	}

	s.Storage = store

	return s, nil
}

// grpcHttpHandler calls serves the gRPC gateway or the direct gRPC server, depending on the request type
func grpcHttpHandler(grpcServer *grpc.Server, httpHandler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.ProtoMajor == 2 && strings.Contains(r.Header.Get("Content-Type"), "application/grpc") {
			grpcServer.ServeHTTP(w, r)
		} else {
			// pass to the gRPC gateway, the gateway will call this handler again but deal with HTTP conversions first
			httpHandler.ServeHTTP(w, r)
		}
	})
}

// Run the server on the specified port
func Run(plaintextPort, tlsPort, dsn string, cors bool) {
	s, err := NewServer(dsn)
	if err != nil {
		log.Error().Stack().Err(err)
		os.Exit(1)
	}

	g := grpc.NewServer(
		grpc.UnaryInterceptor(
			grpc_middleware.ChainUnaryServer(
				validateAuthzInterceptor("TODO"),
				grpc_validator.UnaryServerInterceptor(),
			),
		),
	)

	v1.RegisterVValletServiceServer(g, s)

	gwmux := runtime.NewServeMux()
	// this connection is internal, so skip connection verification
	creds := credentials.NewTLS(&tls.Config{InsecureSkipVerify: true})
	grpcAddr := fmt.Sprintf("localhost:%s", tlsPort)

	err = v1.RegisterVValletServiceHandlerFromEndpoint(context.Background(), gwmux, grpcAddr, []grpc.DialOption{grpc.WithTransportCredentials(creds)})
	if err != nil {
		log.Error().Stack().Err(err)
		os.Exit(1)
	}

	mux := http.NewServeMux()
	mux.Handle("/v1/", gwmux)

	if plaintextPort != "" {
		log.Warn().Msgf("starting plaintext server on localhost:%s, this should only be done for local development", plaintextPort)
		plaintextServer := &http.Server{
			Addr:    ":" + plaintextPort,
			Handler: corsHandler(cors, grpcHttpHandler(g, mux)),
		}
		go func() {
			log.Fatal().Stack().Err(plaintextServer.ListenAndServe())
		}()
	}

	tlsServer := &http.Server{
		Addr:    ":" + tlsPort,
		Handler: corsHandler(cors, grpcHttpHandler(g, mux)),
	}

	log.Printf("Serving TLS on %s", grpcAddr)
	log.Fatal().Stack().Err(tlsServer.ListenAndServeTLS(serverCertFile, serverKeyFile))
}
