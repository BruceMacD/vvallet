package internal

import "fmt"

var (
	ErrUnexpected = fmt.Errorf("an unexpected error occured")

	ErrEmptyAlias  = fmt.Errorf("identity alias is required")
	ErrAliasExists = fmt.Errorf("a identity with this alias already exists")

	ErrEmptyKey        = fmt.Errorf("public key serial is required")
	ErrPublicKeyExists = fmt.Errorf("this public key is already registered with an alias")
)
