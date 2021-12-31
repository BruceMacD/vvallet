package main

import (
	"flag"
	"log"
	"os"
	"strings"

	"github.com/BruceMacD/vvallet/internal"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
)

// input args
var (
	plaintextPort string
	tlsPort       string
	logLevel      string
	dsn           string
	cors          bool
)

const (
	vvalletEnvPrefix = "VVALLET_"
	plaintextPortEnv = vvalletEnvPrefix + "PLAINTEXT_PORT"
	tlsPortEnv       = vvalletEnvPrefix + "TLS_PORT"
	logLevelEnv      = vvalletEnvPrefix + "LOG_LEVEL"
	dsnEnv           = vvalletEnvPrefix + "DSN"
	corsEnv          = vvalletEnvPrefix + "CORS"
)

func main() {
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

	flag.StringVar(&plaintextPort, "plaintextPort", "", "local port to run the HTTP server on")
	flag.StringVar(&tlsPort, "tlsPort", "", "local port to run the HTTPS server on")
	flag.StringVar(&logLevel, "logLevel", "", "output logging level")
	flag.StringVar(&dsn, "dsn", "", "postgres database dsn of the form 'host=localhost user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai'")
	flag.BoolVar(&cors, "cors", false, "enable cors")
	flag.Parse()

	// fallback to environment variables check
	if plaintextPort == "" {
		plaintextPort = os.Getenv(plaintextPortEnv)
	}

	if tlsPort == "" {
		tlsPort = os.Getenv(tlsPortEnv)
	}

	if logLevel == "" {
		logLevel = os.Getenv(logLevelEnv)
	}

	if dsn == "" {
		dsn = os.Getenv(dsnEnv)
	}

	if os.Getenv(corsEnv) == "true" {
		cors = true
	}

	// if these requirements aren't set now, halt execution
	var requiredIns []string
	if tlsPort == "" {
		requiredIns = append(requiredIns, "tlsPort")
	}

	if dsn == "" {
		requiredIns = append(requiredIns, "dsn")
	}

	if len(requiredIns) > 0 {
		log.Fatalf("Required input(s) not found: %+q", requiredIns)
	}

	// ports should have no formatting
	if strings.HasPrefix(plaintextPort, ":") {
		log.Fatalf("Plaintext port should have no leading colon")
	}

	if strings.HasPrefix(tlsPort, ":") {
		log.Fatalf("TLS port should have no leading colon")
	}

	// set the log level
	level, err := zerolog.ParseLevel(logLevel)
	if err != nil {
		log.Fatalf("Parse log level: %+q", requiredIns)
	}
	zerolog.SetGlobalLevel(level)

	internal.Run(plaintextPort, tlsPort, dsn, cors)
}
