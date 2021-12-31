package internal

import (
	"context"
	"time"

	v1 "github.com/BruceMacD/vvallet/internal/v1"
	"github.com/rs/zerolog/log"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *server) Register(ctx context.Context, req *v1.RegistrationRequest) (*v1.Identity, error) {
	if err := req.Validate(); err != nil {
		log.Debug().Stack().Err(err)
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	u, err := CreateIdentity(s.Storage.DB, req.Alias, req.PublicKey)
	if err != nil {
		switch err {
		case ErrEmptyAlias:
			return nil, status.Error(codes.InvalidArgument, err.Error())
		case ErrAliasExists:
			return nil, status.Error(codes.AlreadyExists, err.Error())
		case ErrPublicKeyExists:
			return nil, status.Error(codes.AlreadyExists, err.Error())
		default:
			log.Error().Stack().Err(err)
			return nil, ErrUnexpected
		}
	}

	return u, nil
}

func (s *server) RequestAuthentication(ctx context.Context, req *v1.AuthenticationRequest) (*v1.JWT, error) {
	if err := req.Validate(); err != nil {
		log.Debug().Stack().Err(err)
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	// TODO: actual authentication
	log.Debug().Msg("recieved request")

	// for testing
	time.Sleep(10 * time.Second)

	log.Debug().Msg("response sent")

	return &v1.JWT{Token: "sOmEvAlUe"}, nil
}
