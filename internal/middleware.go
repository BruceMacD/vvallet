package internal

import (
	"context"
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
