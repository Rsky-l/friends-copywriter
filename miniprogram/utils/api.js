const app = getApp();

function request(method, path, data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.apiBase + path,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'X-Device-Id': app.globalData.deviceId
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject({ statusCode: res.statusCode, ...res.data });
        }
      },
      fail(err) {
        wx.showToast({ title: '网络连接失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

const api = {
  // 场景
  getScenes(keyword) {
    return request('GET', '/api/scenes' + (keyword ? `?keyword=${keyword}` : ''));
  },

  // 生成表达
  generate(data) {
    return request('POST', '/api/generate', data);
  },

  // 模拟对战
  startBattle(data) {
    return request('POST', '/api/battle/start', data);
  },
  battleTurn(data) {
    return request('POST', '/api/battle/turn', data);
  },
  endBattle(data) {
    return request('POST', '/api/battle/end', data);
  },

  // 笔记
  getNotes(params = {}) {
    const query = Object.keys(params)
      .filter(k => params[k] !== undefined && params[k] !== null)
      .map(k => `${k}=${encodeURIComponent(params[k])}`)
      .join('&');
    return request('GET', '/api/notes' + (query ? `?${query}` : ''));
  },
  saveNote(data) {
    return request('POST', '/api/notes', data);
  },
  deleteNote(id) {
    return request('DELETE', `/api/notes/${id}`);
  },
  toggleStar(id) {
    return request('PATCH', `/api/notes/${id}/star`);
  },

  // 历史
  getHistory(params = {}) {
    const query = Object.keys(params)
      .filter(k => params[k] !== undefined)
      .map(k => `${k}=${encodeURIComponent(params[k])}`)
      .join('&');
    return request('GET', '/api/generate/history' + (query ? `?${query}` : ''));
  }
};

module.exports = api;
