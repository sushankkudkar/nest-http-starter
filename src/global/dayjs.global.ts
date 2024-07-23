/**
 * Day.js Global Configuration.
 * @file Configures Day.js for localized formatting and settings.
 * @module config/dayjs
 * @description Sets up Day.js with locale and plugin extensions.
 */

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import localizedFormat from 'dayjs/plugin/localizedFormat'

// Set Day.js locale to Chinese (Simplified)
dayjs.locale('zh-cn')

// Extend Day.js with localized format plugin
dayjs.extend(localizedFormat)
