package internal

import (
	"fmt"
	"os"
	"testing"

	v1 "github.com/BruceMacD/vvallet/internal/v1"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var memDB *gorm.DB

func TestMain(m *testing.M) {
	// setup
	var err error
	memDB, err = gorm.Open(sqlite.Open("file::memory:"), &gorm.Config{})
	if err != nil {
		fmt.Printf("failed to run tests, database error: %s\n", err.Error())
		os.Exit(1)
	}

	if err = memDB.AutoMigrate(&PublicKey{}); err != nil {
		fmt.Printf("failed to run tests, database migration error: %s\n", err.Error())
		os.Exit(1)
	}

	if err = memDB.AutoMigrate(&Identity{}); err != nil {
		fmt.Printf("failed to run tests, database migration error: %s\n", err.Error())
		os.Exit(1)
	}

	// run tests
	result := m.Run()

	// can put stuff that runs after tests here

	os.Exit(result)
}

func TestRegisterValidIdentity(t *testing.T) {
	alias := "Steve-B"
	serial := "valid"

	usr, err := CreateIdentity(memDB, alias, &v1.PublicKey{Alg: v1.Algorithm_ECDSA_P384, Serial: serial})

	assert.NoError(t, err)
	assert.Equal(t, alias, usr.Alias)
	assert.Equal(t, v1.Algorithm_ECDSA_P384, usr.PublicKey.Alg)
	assert.Equal(t, serial, usr.PublicKey.Serial)
}

func TestDuplicateAlias(t *testing.T) {
	alias := "Steve_Ballmer"
	serial := "duplicate-alias-serial-1"

	_, err := CreateIdentity(memDB, alias, &v1.PublicKey{Alg: v1.Algorithm_ECDSA_P384, Serial: serial})
	assert.NoError(t, err)

	serial = "duplicate-alias-serial-2"

	_, err = CreateIdentity(memDB, alias, &v1.PublicKey{Alg: v1.Algorithm_ECDSA_P384, Serial: serial})
	assert.ErrorIs(t, ErrAliasExists, err)
}

func TestEmptyAlias(t *testing.T) {
	alias := ""
	serial := "0x0"

	_, err := CreateIdentity(memDB, alias, &v1.PublicKey{Alg: v1.Algorithm_ECDSA_P384, Serial: serial})
	assert.ErrorIs(t, ErrEmptyAlias, err)
}

func TestDuplicateKey(t *testing.T) {
	serial := "duplicate-serial"

	_, err := CreateIdentity(memDB, "bob", &v1.PublicKey{Alg: v1.Algorithm_ECDSA_P384, Serial: serial})
	assert.NoError(t, err)

	_, err = CreateIdentity(memDB, "alice", &v1.PublicKey{Alg: v1.Algorithm_ECDSA_P384, Serial: serial})
	assert.ErrorIs(t, ErrPublicKeyExists, err)
}

func TestEmptyKey(t *testing.T) {
	serial := ""
	_, err := CreateIdentity(memDB, "empty-key-uname", &v1.PublicKey{Alg: v1.Algorithm_ECDSA_P384, Serial: serial})
	assert.ErrorIs(t, ErrEmptyKey, err)
}
