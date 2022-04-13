import service from "./basic";

const InstanceURL = '/api/instance'

export function getInstances(page = 0, size = 0) {
  return service.get(InstanceURL, {params: {page, size}});
}
