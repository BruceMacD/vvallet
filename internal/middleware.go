package internal

import (
	"context"
	"net/http"
	"strings"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// endpoints that can be called without authorization
var public = map[string]bool{
	"/v1.VValletService/Register": true,
}

// validateAuthzInterceptor checks if authroization is required for an action, then validate the request API key
func validateAuthzInterceptor(apiKey string) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
		if public[info.FullMethod] {
			return handler(ctx, req)
		}

		meta, ok := metadata.FromIncomingContext(ctx)
		if !ok {
			return nil, status.Error(codes.PermissionDenied, "unauthorized")
		}

		bearer, ok := meta["authorization"]
		if !ok {
			return nil, status.Error(codes.PermissionDenied, "unauthorized")
		}

		token := strings.Replace(bearer[0], "Bearer ", "", -1)
		if token == apiKey {
			return handler(ctx, req)
		}

		return nil, status.Error(codes.PermissionDenied, "unauthorized")
	}
}

func corsHandler(enabled bool, next http.Handler) http.Handler {
	if enabled {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization, ResponseType")
			next.ServeHTTP(w, r)
		})
	} else {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			next.ServeHTTP(w, r)
		})
	}
}
