import service from "./basic";

export const UserLevelGeneral = 0
export const UserLevelAdmin = 1
export const UserLevelRoot = 2

const LoginURL = '/api/login'
const LogoutURL = '/api/logout'
const UserURL = '/api/user'
const PasswordURL = '/api/user/password'
const LevelURL = '/api/user/level'
const FreezeURL = '/api/user/freeze'

export function login(username, password) {
  return service.post(LoginURL, {
    username: username,
    password: password,
  });
}

export function logout() {
  return service.post(LogoutURL);
}

export function getUsers(page = 1, size = 10) {
  return service.get(UserURL, {params: {page, size}});
}

export function addUser(user) {
  return service.put(UserURL, user);
}

export function changePassword(oldPassword, newPassword) {
  return service.post(PasswordURL, {
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
}

export function resetPassword(userID, newPassword) {
  return service.post(PasswordURL, {
    id: userID,
    newPassword: newPassword,
  });
}

export function setUserLevel(userID, level) {
  return service.post(LevelURL, {
    id: userID,
    level: level,
  });
}

export function freezeUser(userID, freeze) {
  return service.post(FreezeURL, {
    userID: userID,
    isFrozen: freeze
  })
}

export function deleteUser(userID) {
  return service.delete(UserURL, {params: {id: userID}})
}