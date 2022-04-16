import service from "./basic"

export function serverTimeToDisplay(timeStr) {
  if(!timeStr || timeStr.length === 0) {
    return '-'
  }
  let date = new Date(timeStr)
  if(date.getFullYear() <= 1970) {
    return '-'
  }
  return date.toLocaleString()
}

const MetaInfoURL = "/api/meta"

export function getMetaInfo() {
  return service.get(MetaInfoURL)
}