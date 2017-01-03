import Ember from 'ember';

export default Ember.Component.extend({
  splitContainer: null,
  isVertical: Ember.computed.readOnly('splitContainer.isVertical'),
  splitterWidth: Ember.computed.readOnly('splitContainer.splitterWidth'),
  siblingsVisible: Ember.computed.and('splitContainer.leading', 'splitContainer.trailing'),

  minimumPercentage: 10,

  classNameBindings: ['isVertical:vertical:horizontal'],
  classNames: ['happy-split-view'],

  _percentage: undefined,
  splitPercentage: Ember.computed('minimumPercentage', {
    get: function () {
      return this._percentage || 50;
    },
    set: function (key, value) {
      this._percentage = Math.max(this.get('minimumPercentage'), value);
      return this._percentage;
    }
  }),

  setupSplitView: Ember.on('didInsertElement', function () {
    this.get('splitContainer').send('addView', this);
    this.updateDimensions();
  }),

  teardownSplitView: Ember.on('willDestroyElement', function () {
    this.get('splitContainer').send('removeView', this);
  }),

  updateDimensions: Ember.observer('splitPercentage', 'splitterWidth', 'isVertical','siblingsVisible', function () {
    var percentage = this.get('splitPercentage'),
      // split the width of the splitter between the left/right or top/bottom views
      splitterWidth = this.get('splitterWidth') / 2,
      style = this.element.style,
      dimension = this.get('siblingsVisible') ? `calc(${percentage}% - ${splitterWidth}px)` : 'calc(100%)';

    if (this.get('isVertical')) {
      style.width = dimension;
    }
    else {
      style.height = dimension;
    }
  })
});
