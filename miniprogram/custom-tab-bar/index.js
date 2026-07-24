Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/square/square',
        text: '场景广场',
        iconPath: '/images/tab-scene.png',
        selectedIconPath: '/images/tab-scene-active.png'
      },
      {
        pagePath: '/pages/training/training',
        text: '训练场',
        iconPath: '/images/tab-training.png',
        selectedIconPath: '/images/tab-training-active.png'
      },
      {
        pagePath: '/pages/profile/profile',
        text: '我的',
        iconPath: '/images/tab-profile.png',
        selectedIconPath: '/images/tab-profile-active.png'
      }
    ]
  },

  lifetimes: {
    attached() {
      this.updateProfileIcon();
    }
  },

  pageLifetimes: {
    show() {
      this.updateProfileIcon();
    }
  },

  methods: {
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset;
      if (this.data.selected !== index) {
        wx.switchTab({ url: path });
      }
    },

    updateProfileIcon() {
      const gender = wx.getStorageSync('profileGender') || 'female';
      const baseIcon = `/images/tab-profile-${gender}`;

      // 检查自定义图标是否存在 - 使用简单逻辑：如果设置了男性则用男性图标
      const list = this.data.list.map((item, i) => {
        if (i === 2) {
          return {
            ...item,
            iconPath: `${baseIcon}.png`,
            selectedIconPath: `${baseIcon}-active.png`
          };
        }
        return item;
      });

      this.setData({ list });
    }
  }
});
