<template>
  <div
    :id="`${$attrs.id}-wrapper`"
    ref="parent"
    v-click-outside="closePicker"
    class="date-time-picker"
  >
    <!-- Input -->
    <CustomInput
      v-if="hasInput"
      :id="`${$attrs.id}-input`"
      ref="custom-input"
      v-model="dateFormatted"
      v-bind="$attrs"
      :dark="dark"
      :hint="hint"
      :error-hint="error"
      :is-focus="hasPickerOpen"
      :color="color"
      :label="label"
      :no-label="noLabel"
      :input-size="inputSize"
      :no-clear-button="noClearButton"
      @focus="toggleDatePicker(true)"
      @clear="$emit('input', null)"
    />
    <slot
      v-else
    />

    <div
      v-if="hasPickerOpen && overlay"
      class="time-picker-overlay"
      @click.stop="closePicker"
    />

    <!-- Date picker container -->
    <PickersContainer
      v-if="!isDisabled"
      :id="`${$attrs.id}-picker-container`"
      ref="agenda"
      v-model="dateTime"
      :visible="hasPickerOpen"
      :position="pickerPosition"
      :inline="inline"
      :color="color"
      :button-color="buttonColor"
      :dark="dark"
      :no-header="noHeader"
      :only-time="onlyTime"
      :only-date="hasOnlyDate"
      :minute-interval="minuteInterval"
      :second-interval="secondInterval"
      :locale="locale"
      :min-date="minDate"
      :max-date="maxDate"
      :format="format"
      :no-weekends-days="noWeekendsDays"
      :disabled-weekly="disabledWeekly"
      :has-button-ok="hasButtonOk"
      :has-no-button="hasNoButton"
      :range="range"
      :disabled-dates="disabledDates"
      :disabled-hours="disabledHours"
      :enabled-dates="enabledDates"
      :no-shortcuts="noShortcuts"
      :button-now-translation="buttonNowTranslation"
      :button-confirm-translation="buttonConfirmTranslation"
      :no-button-now="noButtonNow"
      :first-day-of-week="firstDayOfWeek"
      :shortcut="shortcut"
      :custom-shortcuts="customShortcuts"
      :no-keyboard="noKeyboard"
      :right="right"
      :behaviour="_behaviour"
      @ok="onOk"
      @close="closePicker"
    />
  </div>
</template>

<script>
import moment from 'moment'
import vClickOutside from 'v-click-outside'

import CustomInput from './_subs/CustomInput'
import PickersContainer from './_subs/PickersContainer'

import { getDefaultLocale } from '@/components/DatetimePickerVue/utils'

const updateMomentLocale = (locale, firstDayOfWeek) => {
    moment.locale(locale)
    if (firstDayOfWeek) {
      const firstDayNumber = Number.isInteger(firstDayOfWeek) && firstDayOfWeek === 0
        ? 7
        : firstDayOfWeek || moment.localeData(locale).firstDayOfWeek()
      moment.updateLocale(locale, {
        week: {
          dow: firstDayNumber
        }
      })
    }
  }

  const nearestMinAndSec = (minInterval, secInterval, date, format) => {
    const roundedMinutes = Math.ceil(date.minute() / minInterval) * minInterval
    const roundedSeconds = Math.ceil(date.second() / secInterval) * secInterval

    return moment(date.clone().minute(roundedMinutes).second(roundedSeconds), format)
  }

  /**
   * Object containing the default behaviour values of the calendar.
   * Those values can be overrided by the `behaviour` property.
   * @const defaultBehaviour
   */
  const defaultBehaviour = {
    time: {
      nearestIfDisabled: true
    }
  }

  export default {
    name: 'DatetimePickerVue',
    components: {
      CustomInput,
      PickersContainer
    },
    directives: {
      clickOutside: vClickOutside.directive
    },
    inheritAttrs: false,
    props: {
      value: { type: [String, Object], default: null },
      label: { type: String, default: 'Select date & time' },
      noLabel: { type: Boolean, default: false },
      hint: { type: String, default: null },
      error: { type: Boolean, default: null },
      color: { type: String, default: 'dodgerblue' },
      buttonColor: { type: String, default: null },
      dark: { type: Boolean, default: false },
      overlay: { type: Boolean, default: false },
      inline: { type: Boolean, default: false },
      position: { type: String, default: null },
      locale: { type: String, default: getDefaultLocale() },
      format: { type: String, default: 'YYYY-MM-DD hh:mm:ss a' },
      outputFormat: { type: String, default: 'YYYY-MM-DD hh:mm:ss a' },
      minuteInterval: { type: [String, Number], default: 1 },
      secondInterval: { type: [String, Number], default: 1 },
      minDate: { type: String, default: null },
      maxDate: { type: String, default: null },
      autoClose: { type: Boolean, default: false },
      onlyTime: { type: Boolean, default: false },
      onlyDate: { type: Boolean, default: false },
      noHeader: { type: Boolean, default: false },
      range: { type: Boolean, default: false },
      noWeekendsDays: { type: Boolean, default: false },
      disabledWeekly: { type: Array, default: () => ([]) },
      noShortcuts: { type: Boolean, default: false },
      noButton: { type: Boolean, default: false },
      disabledDates: { type: Array, default: () => ([]) },
      disabledHours: { type: Array, default: () => ([]) },
      enabledDates: { type: Array, default: () => ([]) },
      open: { type: Boolean, default: false },
      persistent: { type: Boolean, default: false },
      inputSize: { type: String, default: null },
      buttonNowTranslation: { type: String, default: null },
      buttonConfirmTranslation: { type: String, default: null },
      noButtonNow: { type: Boolean, default: false },
      noButtonValidate: { type: Boolean, default: false },
      firstDayOfWeek: { type: Number, default: null },
      shortcut: { type: String, default: null },
      customShortcuts: {
        type: Array,
        default: () => ([
          { key: 'thisWeek', label: 'This week', value: 'isoWeek' },
          { key: 'lastWeek', label: 'Last week', value: '-isoWeek' },
          { key: 'last7Days', label: 'Last 7 days', value: 7 },
          { key: 'last30Days', label: 'Last 30 days', value: 30 },
          { key: 'thisMonth', label: 'This month', value: 'month' },
          { key: 'lastMonth', label: 'Last month', value: '-month' },
          { key: 'thisYear', label: 'This year', value: 'year' },
          { key: 'lastYear', label: 'Last year', value: '-year' }
        ])
      },
      noValueToCustomElem: { type: Boolean, default: false },
      behaviour: { type: Object, default: () => ({}) },
      noKeyboard: { type: Boolean, default: false },
      right: { type: Boolean, default: false },
      noClearButton: { type: Boolean, default: false }
    },
    data () {
      return {
        pickerOpen: false,
        pickerPosition: this.position,
        innerValue: '',
        isConfirm: false
      }
    },
    computed: {
      hasPickerOpen () {
        return this.persistent || this.pickerOpen
      },
      hasNoButton () {
        return this.noButton
      },
      hasButtonOk () {
        return !this.inline && !this.autoClose
      },
      hasOnlyDate () {
        return this.onlyDate || this.range
      },
      dateFormatted () {
        return this.range
          ? this.getRangeDatesFormatted(this.locale)
          : this.getDateFormatted(this.locale)
      },
      hasCustomElem () {
        return this.$slots.default
      },
      hasInput () {
        return !this.inline && !this.$slots.default
      },
      dateTime: {
        get () {
          return this.range
            ? {
              start: this.value && this.value.start ? moment(this.value.start, this.format).format('YYYY-MM-DD') : null,
              end: this.value && this.value.end ? moment(this.value.end, this.format).format('YYYY-MM-DD') : null
            }
            : this.getDateTime()
        },
        set (value) {
          if (this.autoClose && this.range && (value.end && value.start)) {
            this.closePicker()
          } else if (this.autoClose && !this.range) {
            this.closePicker()
          }
          const newValue = this.range ? this.getRangeDateToSend(value) : this.getDateTimeToSend(value)
          this.$emit('input', newValue)
          if (this.hasCustomElem && !this.noValueToCustomElem) {
            this.$nextTick(() => {
              this.setValueToCustomElem()
            })
          }
        }
      },
      /**
       * Returns true if the field is disabled
       * @function isDisabled
       * @returns {boolean}
       */
      isDisabled () {
        return typeof this.$attrs.disabled !== 'undefined' && this.$attrs.disabled !== false
      },
      /**
       * Returns the behaviour object with the overrided values
       * @function _behaviour
       * @returns {Object}
       */
      _behaviour () {
        const { time } = defaultBehaviour

        return {
          time: {
            ...time,
            ...this.behaviour.time
          }
        }
      }
    },
    watch: {
      open (val) {
        if (this.isDisabled) return
        this.pickerOpen = val
      },
      locale (value) {
        updateMomentLocale(value, this.firstDayOfWeek)
      }
    },
    created () {
      updateMomentLocale(this.locale, this.firstDayOfWeek)
    },
    mounted () {
      this.pickerPosition = this.getPosition()
      this.pickerOpen = this.open
      if (this.hasCustomElem) {
        this.addEventToTriggerElement()
        if (!this.noValueToCustomElem) {
          this.setValueToCustomElem()
        }
      }
      if (this.format === 'YYYY-MM-DD hh:mm a' && this.onlyTime) {
        console.warn(`A (time) format must be indicated/ (Ex : format="HH:mm")`)
      }
    },
    beforeDestroy () {
      this.$emit('destroy')
      if (this.hasCustomElem) {
        this.addEventToTriggerElement()
      }
    },
    methods: {
      setValueToCustomElem () {
        /**
         * TODO: Find a way (perhaps), to bind default attrs to custom element.
         */
        const target = this.$slots.default[0]
        if (target) {
          if (target.tag === 'input') {
            target.elm.value = this.dateFormatted
          } else {
            target.elm.innerHTML = this.dateFormatted ? this.dateFormatted : this.label
          }
        } else {
          window.console.warn(`Impossible to find custom element`)
        }
      },
      addEventToTriggerElement () {
        const target = this.$slots.default[0].elm
        if (target) {
          target.addEventListener('click', () => {
            this.toggleDatePicker()
          })
        } else {
          window.console.warn(`Impossible to find custom element`)
        }
      },
      getRangeDatesFormatted () {
        const hasStartValues = this.value && this.value.start
        const hasEndValues = this.value && this.value.end
        if (hasStartValues || hasEndValues) {
          const datesFormatted = hasStartValues ? `${moment(this.value.start, this.format).set({
            hour: 0,
            minute: 0,
            second: 0
          }).format(this.outputFormat)}` : '...'
          return hasEndValues ? `${datesFormatted} - ${moment(this.value.end, this.format).set({
            hour: 23,
            minute: 59,
            second: 59
          }).format(this.outputFormat)}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      },
      getDateFormatted () {
        const date = this.value
          ? moment(this.value, this.format).format(this.outputFormat)
          : null
        return date
      },
      getRangeDateToSend (payload) {
        const { start, end } = typeof payload !== 'undefined' ? payload : this.value
        return start || end
          ? {
            start: start ? moment(start, 'YYYY-MM-DD').set({ hour: 0, minute: 0, second: 0 }).format(this.format) : null,
            end: end ? moment(end, 'YYYY-MM-DD').set({ hour: 23, minute: 59, second: 59 }).format(this.format) : null,
            shortcut: payload.value
          }
          : {
            start: moment().format(this.format),
            end: moment().format(this.format),
            shortcut: payload.value
          }
      },
      getDateTimeToSend (value) {
        const dateTime = typeof value !== 'undefined' ? value : this.value
        const dateToSend = dateTime
          ? moment(dateTime, 'YYYY-MM-DD HH:mm:ss')
          : null
        return dateToSend ? nearestMinAndSec(this.minuteInterval, this.secondInterval, moment(dateToSend), 'YYYY-MM-DD HH:mm:ss').format(this.format) : null
      },
      getDateTime () {
        const date = this.value
          ? moment(this.value, this.format)
          : null
        return date ? nearestMinAndSec(this.minuteInterval, this.secondInterval, date, this.format).format('YYYY-MM-DD HH:mm:ss') : null
      },
      /**
       * Closes the datepicker
       * @function closePicker
       */
      closePicker () {
        if (this.pickerOpen) {
          this.$emit('is-hidden')
          this.$emit('input', this.isConfirm ? this.dateTime : this.innerValue)
          this.pickerOpen = false
          this.setBodyOverflow(false)
        }
      },
      toggleDatePicker (val) {
        if (this.isDisabled) return
        const isOpen = (val === false || val === true) ? val : !this.pickerOpen
        this.setBodyOverflow(isOpen)
        this.pickerOpen = isOpen

        if (isOpen) {
          this.$emit('is-shown')
          /**
           * Cache old value
           */
          this.isConfirm = false
          this.innerValue = this.dateTime
        }

        if (this.pickerOpen && !this.position) {
          this.pickerPosition = this.getPosition()
        }
      },
      setBodyOverflow (value) {
        if (window.innerWidth < 412) {
          const body = document.getElementsByTagName('body')[0]
          body.style.overflow = value ? 'hidden' : null
        }
      },
      getPosition () {
        if (this.position) {
          return this.position
        } else {
          const parentRect = this.$refs.parent.getBoundingClientRect()
          const windowHeight = window.innerHeight
          let datePickerHeight = 445

          datePickerHeight = this.noButton ? datePickerHeight - 41 : datePickerHeight
          datePickerHeight = this.noHeader ? datePickerHeight - 58 : datePickerHeight
          if (parentRect.top < datePickerHeight) {
            // No place on top --> bottom
            return 'bottom'
          } else if (windowHeight - (parentRect.height + datePickerHeight + parentRect.top) >= 0) {
            // Have place on bottom --> bottom
            return 'bottom'
          } else {
            // No place on bottom --> top
            return 'top'
          }
        }
      },
      onOk () {
        this.isConfirm = true
        this.$emit('ok', this.dateTime)
        this.closePicker()
      }
    }
  }
</script>

<style lang="scss">
@import "./assets/main.scss";

.date-time-picker {
  width: 100%;
  margin: 0 auto;
  text-align: left;
  font-size: 14px;
  border-radius: 4px;
  position: relative;

  .time-picker-overlay {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }
}

@media screen and (max-width: 415px) {
  .time-picker-overlay {
    display: none;
  }
  .date-time-picker:not(.inline) {
    position: inherit !important;
  }
}
</style>
