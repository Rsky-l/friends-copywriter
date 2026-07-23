function get(key, defaultValue = null) {
  try {
    const value = wx.getStorageSync(key);
    return value !== '' ? value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
    console.error('Storage set failed:', e);
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    console.error('Storage remove failed:', e);
  }
}

// 草稿保存与恢复
function saveDraft(sceneId, data) {
  set(`draft_${sceneId}`, data);
}

function getDraft(sceneId) {
  return get(`draft_${sceneId}`, null);
}

function clearDraft(sceneId) {
  remove(`draft_${sceneId}`);
}

module.exports = { get, set, remove, saveDraft, getDraft, clearDraft };
