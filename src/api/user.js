import service from "./basic";

export const UserLevelGeneral = 0
export const UserLevelAdmin = 1
export const UserLevelRoot = 2

const LoginURL = '/api/login'
const LogoutURL = '/api/logout'
const PasswordURL = '/api/user/password'

export function login(username, password) {
  return service.post(LoginURL, {
    username: username,
    password: password,
  });
}

export function logout() {
  return service.post(LogoutURL);
}

export function changePassword(oldPassword, newPassword) {
  return service.post(PasswordURL, {
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
}