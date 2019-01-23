import { VantComponent } from '../common/component';
VantComponent({
  classes: ['title-class','com'],
  props: {
    title: String,
    leftText: String,
    rightText: String,
    leftArrow: Boolean,
    fixed: Boolean,
    zIndex: {
      type: Number,
      value: 100000
    }
  },
  methods: {
    onClickLeft: function onClickLeft() {
      this.$emit('click-left');
      wx.navigateBack();
    },
    onClickRight: function onClickRight() {
      this.$emit('click-right');
    }
  }
});