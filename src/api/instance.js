import service from "./basic";

const InstanceURL = '/api/instance'
const FreezeInstanceURL = '/api/instance/freeze'

export function getInstances(page = 0, size = 0) {
  return service.get(InstanceURL, {params: {page, size}});
}

export function addInstance(instance) {
  return service.put(InstanceURL, instance)
}

export function freezeInstance(identifier, isFrozen) {
  return service.post(FreezeInstanceURL, {identifier, isFrozen})
}

export function destroyInstance(identifier) {
  return service.delete(InstanceURL, {params: {identifier}})
}
