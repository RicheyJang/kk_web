import axios from 'axios';
import store from '../store/index';
import i18n from '../locales/i18n';
import router from '../router/index';

const service = axios.create({ // 生成一个axios实例
  timeout: 5000, // 请求超时时间
  headers: {
		'Content-Type': 'application/json',
	},
  transformRequest: data => JSON.stringify(data)
});

// 请求拦截器
service.interceptors.request.use(config => {
  if(store.state.token.length > 0) {
    config.headers['Authorization'] = 'Bearer ' + store.state.token;
  }
  return config;
}, error => {
    return Promise.reject(error);
});

// 错误码
export const CodeUnknown = 10000
export const CodePermission  = 10003
export const CodeWrongPasswd = 10004
export const CodeUserFrozen  = 10005
export const CodeNeedLogin   = 10006
export const CodeUserExist   = 10007
export const CodeInstanceExist = 10008
export const CodeInstanceFrozen = 10009
export const CodeKeeperSupport  = 10010

function getMsgByCode(code) {
  switch(code) {
    case 404:
      return i18n.global.t('error.server')
    case 500:
      return i18n.global.t('error.server')
    case CodePermission:
      return i18n.global.t('error.permission')
    case CodeWrongPasswd:
      return i18n.global.t('error.wrongPasswd')
    case CodeUserFrozen:
      return i18n.global.t('error.userFrozen')
    case CodeUserExist:
      return i18n.global.t('error.userExist')
    case CodeInstanceExist:
      return i18n.global.t('error.instanceExist')
    case CodeInstanceFrozen:
      return i18n.global.t('error.instanceFrozen')
    case CodeKeeperSupport:
      return i18n.global.t('error.keeperSupport')
    case CodeNeedLogin:
      ElMessageBox.alert(i18n.global.t('error.needLogin'), i18n.global.t('error.loginTimeout'), {
        confirmButtonText: i18n.global.t('confirm'),
        callback: action => {
          store.commit('setToken', '')
          router.replace({
            name: 'Login'
          })
        },
      })
      return i18n.global.t('error.needLogin')
    default:
      return i18n.global.t('error.unknown')
  }
}

// 响应拦截器
service.interceptors.response.use(response => {
  // 响应码 2xx
  return response;
}, error => {
  let rsp;
  if (error.response) { // 有回包，但响应码不是2XX
    rsp = error.response
    if (typeof rsp.data != 'object') {
      rsp.data = {
        code: +rsp.status,
        msg: rsp.data
      }
    }
  } else if (error.request) { // 没有回包
    rsp = {
      request: error.request,
      data: {
        code: CodeUnknown,
      }
    }
  } else { // 设置Request时出错
    rsp = {
      data: {
        code: CodeRequest,
      }
    }
  }
  // 错误处理
  rsp.data.msg = getMsgByCode(rsp.data.code)
  return Promise.reject(rsp);
});

export default service;