const api = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: {
    sceneId: '',
    sceneName: '',
    sceneIcon: '',
    opponentView: '',
    userThoughts: '',
    generating: false,
    recording: false
  },

  onLoad(options) {
    const { sceneId, sceneName, sceneIcon } = options;
    this.setData({
      sceneId: sceneId || '',
      sceneName: decodeURIComponent(sceneName || ''),
      sceneIcon: decodeURIComponent(sceneIcon || '')
    });

    wx.setNavigationBarTitle({
      title: sceneName ? decodeURIComponent(sceneName) : '生成表达'
    });

    const draft = storage.getDraft(sceneId);
    if (draft) {
      this.setData({
        opponentView: draft.opponentView || '',
        userThoughts: draft.userThoughts || ''
      });
    }

    // 初始化录音管理器
    this.initRecorder();
  },

  onUnload() {
    if (this.data.opponentView || this.data.userThoughts) {
      storage.saveDraft(this.data.sceneId, {
        opponentView: this.data.opponentView,
        userThoughts: this.data.userThoughts
      });
    }
  },

  onOpponentInput(e) {
    this.setData({ opponentView: e.detail.value });
  },

  onThoughtsInput(e) {
    this.setData({ userThoughts: e.detail.value });
  },

  onThoughtsBlur() {
    this.setData({ focusThoughts: false });
  },

  onVoiceInput() {
    // 真机上通过 textarea 的键盘语音输入是最稳定的方式
    // 这里提供一个引导，同时尝试录音识别
    const that = this;

    wx.showActionSheet({
      itemList: ['🎤 开始录音转文字', '⌨️ 使用键盘语音输入'],
      success(res) {
        if (res.tapIndex === 0) {
          that.startRecording();
        } else {
          // 引导用户使用键盘语音：聚焦第二个输入框，键盘自带麦克风
          that.setData({ focusThoughts: true });
          wx.showToast({ title: '请点击键盘上的🎤按钮说话', icon: 'none', duration: 2000 });
        }
      }
    });
  },

  initRecorder() {
    const recorderManager = wx.getRecorderManager();

    recorderManager.onStart(() => {
      this.setData({ recording: true });
      wx.showToast({ title: '正在聆听...', icon: 'none', duration: 60000 });
    });

    recorderManager.onStop((res) => {
      this.setData({ recording: false });
      wx.hideToast();

      if (!res.tempFilePath) {
        wx.showToast({ title: '录音失败', icon: 'none' });
        return;
      }

      // 使用微信语音识别插件进行转文字
      wx.showLoading({ title: '识别中...' });
      const plugin = requirePlugin('WechatSI');
      if (plugin && plugin.getRecordRecognitionManager) {
        const recognitionManager = plugin.getRecordRecognitionManager();
        recognitionManager.onRecognize((result) => {
          const currentText = this.data.userThoughts;
          this.setData({
            userThoughts: currentText + (currentText ? '\n' : '') + result
          });
        });
        recognitionManager.onStop(() => {
          wx.hideLoading();
        });
        recognitionManager.start({ lang: 'zh_CN', duration: 60000 });
      } else {
        wx.hideLoading();
        wx.showToast({ title: '语音识别插件未配置，请使用键盘语音输入', icon: 'none', duration: 2000 });
      }

      // 保存录音文件路径
      this._lastRecordPath = res.tempFilePath;
    });

    recorderManager.onError((err) => {
      console.error('录音错误:', err);
      this.setData({ recording: false });
      wx.hideToast();
      wx.showToast({ title: '录音失败，请使用键盘语音输入', icon: 'none' });
    });

    this._recorderManager = recorderManager;
  },

  startRecording() {
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        this._recorderManager.start({
          duration: 60000,
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 48000,
          format: 'mp3'
        });
      },
      fail: () => {
        wx.showModal({
          title: '需要录音权限',
          content: '请在设置中允许使用麦克风，或使用键盘语音输入',
          confirmText: '去设置',
          success(res) {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      }
    });
  },

  async onGenerate() {
    const { opponentView, userThoughts } = this.data;

    if (!opponentView.trim()) {
      wx.showToast({ title: '请填写对方的观点', icon: 'none' });
      return;
    }
    if (!userThoughts.trim()) {
      wx.showToast({ title: '请填写你的想法', icon: 'none' });
      return;
    }

    this.setData({ generating: true });

    try {
      const result = await api.generate({
        scene: this.data.sceneName,
        opponentView,
        userThoughts,
        style: 'logical'
      });

      storage.clearDraft(this.data.sceneId);

      // 通过 globalData 传递结果数据，避免 URL 参数溢出
      const app = getApp();
      app.globalData.lastResult = {
        sceneName: this.data.sceneName,
        sceneIcon: this.data.sceneIcon,
        opponentView,
        userThoughts,
        result
      };

      wx.navigateTo({
        url: '/pages/result/result'
      });
    } catch (err) {
      wx.showToast({ title: err.error || '生成失败，请重试', icon: 'none' });
    } finally {
      this.setData({ generating: false });
    }
  },

  onEnterBattle() {
    wx.navigateTo({
      url: `/pages/battle/battle?sceneId=${this.data.sceneId}&sceneName=${encodeURIComponent(this.data.sceneName)}`
    });
  },

  onViewNotes() {
    wx.navigateTo({
      url: `/pages/notes/notes?scene=${encodeURIComponent(this.data.sceneName)}`
    });
  }
});
