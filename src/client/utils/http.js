export default function(url, config) {
  if (!config.headers) config.headers = {};
  config.headers['X-Auth'] = localStorage.getItem('X-AUTH-TOKEN');
  return fetch(url, config);
}