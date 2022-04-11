import service from "./basic";

const LoginURL = '/api/login'

export function login(username, password) {
  return service.post(LoginURL, {
    username: username,
    password: password,
  });
}