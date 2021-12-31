package internal

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/gofrs/uuid"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Storage struct {
	DB *gorm.DB
}

type PublicKey struct {
	ID      uuid.UUID `gorm:"primaryKey"`
	Created int64     `gorm:"autoCreateTime"`
	Updated int64     `gorm:"autoUpdateTime"`
	Serial  string    `gorm:"uniqueIndex"`
	Alg     string
}

type Identity struct {
	ID        uuid.UUID `gorm:"primaryKey"`
	Created   int64     `gorm:"autoCreateTime"`
	Updated   int64     `gorm:"autoUpdateTime"`
	Alias     string    `gorm:"uniqueIndex"`
	KeyID     uuid.UUID
	PublicKey PublicKey `gorm:"foreignKey:KeyID;references:ID"`
}

func NewStorage(dsn string) (*Storage, error) {
	zlog := log.Output(zerolog.ConsoleWriter{Out: os.Stderr}).With().Caller().Logger()

	DB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.New(
			&zlog,
			logger.Config{
				SlowThreshold:             time.Second,
				LogLevel:                  logger.Silent,
				IgnoreRecordNotFoundError: true,
				Colorful:                  true,
			},
		),
	})
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}

	if err = DB.AutoMigrate(&PublicKey{}); err != nil {
		return nil, fmt.Errorf("migrate keys: %w", err)
	}

	if err = DB.AutoMigrate(&Identity{}); err != nil {
		return nil, fmt.Errorf("migrate identities: %w", err)
	}

	s := &Storage{DB: DB}

	return s, nil
}

// Gorm hooks that get called on database events

func (k *PublicKey) BeforeCreate(db *gorm.DB) error {
	id, err := uuid.NewV4()
	if err != nil {
		return err
	}

	k.ID = id
	return nil
}

func (i *Identity) BeforeCreate(db *gorm.DB) error {
	id, err := uuid.NewV4()
	if err != nil {
		return err
	}

	i.ID = id
	return nil
}

// entity data modification, database modification should not be called externally of this file

// PersistPublicKey creates a PublicKey in a database
func PersistPublicKey(db *gorm.DB, key *PublicKey) error {
	if err := db.Create(&key).Error; err != nil {
		return fmt.Errorf("create public key: %w", err)
	}
	return nil
}

func GetPublicKeyBySerial(db *gorm.DB, serial string) (*PublicKey, error) {
	var k PublicKey

	if err := db.Where(&PublicKey{Serial: serial}).First(&k).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("get key by serial: %w", err)
	}

	return &k, nil
}

// PersistIdentity creates a Identity in a database
func PersistIdentity(db *gorm.DB, identity *Identity) error {
	if err := db.Create(&identity).Error; err != nil {
		return fmt.Errorf("create identity: %w", err)
	}
	return nil
}

func GetIdentityByAlias(db *gorm.DB, alias string) (*Identity, error) {
	var i Identity

	if err := db.Where(&Identity{Alias: alias}).First(&i).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("get identity by alias: %w", err)
	}

	return &i, nil
}
