import DatetimePickerVue from '../components/DatetimePickerVue'

DatetimePickerVue.install = function (Vue, options = {}) {
  Vue.component(options.componentName || DatetimePickerVue.name, DatetimePickerVue)
}

export default DatetimePickerVue
