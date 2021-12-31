package internal

import (
	"fmt"

	v1 "github.com/BruceMacD/vvallet/internal/v1"
	"gorm.io/gorm"
)

func CreateIdentity(db *gorm.DB, alias string, key *v1.PublicKey) (*v1.Identity, error) {
	// no empty aliases
	if len(alias) == 0 {
		return nil, ErrEmptyAlias
	}

	// no empty key serial
	if len(key.Serial) == 0 {
		return nil, ErrEmptyKey
	}

	// no duplicate aliases
	existingUsr, err := GetIdentityByAlias(db, alias)
	if existingUsr != nil {
		// identity exists
		return nil, ErrAliasExists
	}
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	// no duplicate keys, this should never happen by chance
	existingKey, err := GetPublicKeyBySerial(db, key.Serial)
	if existingKey != nil {
		// key is already registered
		return nil, ErrPublicKeyExists
	}
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	k := UnmarshalKey(key)
	if err := PersistPublicKey(db, k); err != nil {
		return nil, fmt.Errorf("create identity key: %w", err)
	}

	i := &Identity{
		Alias: alias,
		KeyID: k.ID,
	}

	if err := PersistIdentity(db, i); err != nil {
		return nil, err
	}

	return i.Marshal(k), nil
}

func UnmarshalKey(k *v1.PublicKey) *PublicKey {
	return &PublicKey{
		Alg:    k.Alg.String(),
		Serial: k.Serial,
	}
}

func (k *PublicKey) Marshal() *v1.PublicKey {
	return &v1.PublicKey{
		Id:      k.ID.String(),
		Created: k.Created,
		Updated: k.Updated,
		Alg:     v1.Algorithm_ECDSA_P384, // currently the only algorithm supported
		Serial:  k.Serial,
	}
}

// Marshal the JSON object from the storage model
func (i *Identity) Marshal(k *PublicKey) *v1.Identity {
	return &v1.Identity{
		Id:        i.ID.String(),
		Created:   i.Created,
		Updated:   i.Updated,
		Alias:     i.Alias,
		PublicKey: k.Marshal(),
	}
}
