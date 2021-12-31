/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "./fetch.pb"

export enum Algorithm {
  ECDSA_P384 = "ECDSA_P384",
}

export type PublicKey = {
  id?: string
  created?: string
  updated?: string
  alg?: Algorithm
  serial?: string
}

export type Identity = {
  id?: string
  created?: string
  updated?: string
  alias?: string
  publicKey?: PublicKey
}

export type RegistrationRequest = {
  alias?: string
  publicKey?: PublicKey
}

export type AuthenticationRequest = {
  alias?: string
}

export type JWT = {
  token?: string
}

export type IdentityByAliasRequest = {
  alias?: string
}

export class VValletService {
  static Register(req: RegistrationRequest, initReq?: fm.InitReq): Promise<Identity> {
    return fm.fetchReq<RegistrationRequest, Identity>(`/v1/register`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static IdentityByAlias(req: IdentityByAliasRequest, initReq?: fm.InitReq): Promise<Identity> {
    return fm.fetchReq<IdentityByAliasRequest, Identity>(`/v1/vvallet/${req["alias"]}?${fm.renderURLSearchParams(req, ["alias"])}`, {...initReq, method: "GET"})
  }
  static RequestAuthentication(req: AuthenticationRequest, initReq?: fm.InitReq): Promise<JWT> {
    return fm.fetchReq<AuthenticationRequest, JWT>(`/v1/authenticate`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}