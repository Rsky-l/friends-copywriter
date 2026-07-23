Component({
  properties: {
    scene: {
      type: Object,
      value: {}
    },
    icon: {
      type: String,
      value: '💬'
    },
    name: {
      type: String,
      value: ''
    },
    tags: {
      type: Array,
      value: []
    },
    sceneId: {
      type: String,
      value: ''
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('select', {
        id: this.data.sceneId || this.data.scene.id,
        name: this.data.name || this.data.scene.name,
        icon: this.data.icon || this.data.scene.icon
      });
    }
  }
});
