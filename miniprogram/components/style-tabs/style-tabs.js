Component({
  properties: {
    currentStyle: { type: String, value: 'logical' }
  },

  data: {
    styles: [
      { value: 'logical', name: '逻辑拆解', icon: '🧠', desc: '论据清晰' },
      { value: 'humorous', name: '幽默化解', icon: '😄', desc: '轻松有力' },
      { value: 'rhetorical', name: '反问引导', icon: '❓', desc: '引人思考' },
      { value: 'empathic', name: '情感共鸣', icon: '💛', desc: '温和坚定' }
    ]
  },

  methods: {
    onSelect(e) {
      const style = e.currentTarget.dataset.style;
      this.triggerEvent('change', { style });
    }
  }
});
