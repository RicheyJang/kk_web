import service from "./basic";

const KeysURL = '/api/keys'

export function getKeys(identifier, page, size) {
  return service.get(KeysURL, {params:{page, size}, headers: {identifier}})
}

export function addKey(identifier, key) {
  return service.put(KeysURL, key, {headers: {identifier}})
}

export function destroyKey(identifier, id) {
  return service.delete(KeysURL, {params:{id}, headers: {identifier}})
}