# vvallet app

The vvallet browser app for storing and exploring identity proof assertions.

## Getting Started Locally

First, create a `.env.local` file at the root of the `app` directory:

```
NEXT_PUBLIC_CLUSTER_URL=http://127.0.0.1:8899
```

Run the development server:

```bash
yarn
yarn run dev
```

The app will be served on localhost:3000.

## Deploying to Devnet

First, create a `.env.development` file at the root of the `app` directory:

```
NEXT_PUBLIC_CLUSTER_URL=https://api.devnet.solana.com
```

Build and deploy:

```bash
yarn run dev
```

## Deploying to Mainnet

First, create a `.env.production` file at the root of the `app` directory:

```
NEXT_PUBLIC_CLUSTER_URL=https://api.mainnet-beta.solana.com
```

Build and deploy:

```bash
yarn run start
```
