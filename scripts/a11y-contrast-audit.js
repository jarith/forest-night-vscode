#!/usr/bin/env node

'use strict'

const path = require('node:path')

let getPalette
let getWorkbench
let getSyntax
let getSemantic

try {
  ;({ getPalette } = require(path.resolve(__dirname, '../build/dist/palette')))
  ;({ getWorkbench } = require(path.resolve(__dirname, '../build/dist/workbench')))
  ;({ getSyntax } = require(path.resolve(__dirname, '../build/dist/syntax')))
  ;({ getSemantic } = require(path.resolve(__dirname, '../build/dist/semantic')))
} catch (error) {
  console.error('Unable to load compiled theme modules from build/dist.')
  console.error('Run `yarn compile` before running `yarn audit:a11y`.')
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}

const TEXT_THRESHOLD = 4.5
const UI_THRESHOLD = 3

const pairChecks = [
  {
    fg: 'foreground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'descriptionForeground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editor.foreground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editorCodeLens.foreground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editorInlayHint.foreground',
    bg: 'editorInlayHint.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editorGhostText.foreground',
    bg: 'editorGhostText.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editorLineNumber.foreground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editorLineNumber.activeForeground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editorGutter.commentRangeForeground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'sideBar.foreground',
    bg: 'sideBar.background',
    base: 'sideBar.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'sideBarTitle.foreground',
    bg: 'sideBar.background',
    base: 'sideBar.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'sideBarSectionHeader.foreground',
    bg: 'sideBarSectionHeader.background',
    base: 'sideBar.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'activityBar.foreground',
    bg: 'activityBar.background',
    base: 'activityBar.background',
    threshold: UI_THRESHOLD,
  },
  {
    fg: 'activityBar.inactiveForeground',
    bg: 'activityBar.background',
    base: 'activityBar.background',
    threshold: UI_THRESHOLD,
  },
  {
    fg: 'tab.activeForeground',
    bg: 'tab.activeBackground',
    base: 'tab.activeBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'tab.inactiveForeground',
    bg: 'tab.inactiveBackground',
    base: 'tab.inactiveBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'tab.unfocusedActiveForeground',
    bg: 'tab.activeBackground',
    base: 'tab.activeBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'tab.unfocusedInactiveForeground',
    bg: 'tab.inactiveBackground',
    base: 'tab.inactiveBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'statusBar.foreground',
    bg: 'statusBar.background',
    base: 'statusBar.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'statusBar.debuggingForeground',
    bg: 'statusBar.debuggingBackground',
    base: 'statusBar.debuggingBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'statusBar.noFolderForeground',
    bg: 'statusBar.noFolderBackground',
    base: 'statusBar.noFolderBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'statusBarItem.prominentForeground',
    bg: 'statusBarItem.prominentBackground',
    base: 'statusBarItem.prominentBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'statusBarItem.remoteForeground',
    bg: 'statusBarItem.remoteBackground',
    base: 'statusBarItem.remoteBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'statusBarItem.errorForeground',
    bg: 'statusBarItem.errorBackground',
    base: 'statusBarItem.errorBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'statusBarItem.warningForeground',
    bg: 'statusBarItem.warningBackground',
    base: 'statusBarItem.warningBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'titleBar.activeForeground',
    bg: 'titleBar.activeBackground',
    base: 'titleBar.activeBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'titleBar.inactiveForeground',
    bg: 'titleBar.inactiveBackground',
    base: 'titleBar.inactiveBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'menu.foreground',
    bg: 'menu.background',
    base: 'menu.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'menu.selectionForeground',
    bg: 'menu.selectionBackground',
    base: 'menu.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'dropdown.foreground',
    bg: 'dropdown.background',
    base: 'dropdown.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'input.foreground',
    bg: 'input.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'input.placeholderForeground',
    bg: 'input.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'inputValidation.errorForeground',
    bg: 'inputValidation.errorBackground',
    base: 'inputValidation.errorBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'inputValidation.infoForeground',
    bg: 'inputValidation.infoBackground',
    base: 'inputValidation.infoBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'inputValidation.warningForeground',
    bg: 'inputValidation.warningBackground',
    base: 'inputValidation.warningBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'button.foreground',
    bg: 'button.background',
    base: 'button.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'button.secondaryForeground',
    bg: 'button.secondaryBackground',
    base: 'button.secondaryBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'list.activeSelectionForeground',
    bg: 'list.activeSelectionBackground',
    base: 'sideBar.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'list.inactiveSelectionForeground',
    bg: 'list.inactiveSelectionBackground',
    base: 'sideBar.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'list.focusForeground',
    bg: 'list.focusBackground',
    base: 'sideBar.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'list.errorForeground',
    bg: 'sideBar.background',
    base: 'sideBar.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'list.warningForeground',
    bg: 'sideBar.background',
    base: 'sideBar.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'notificationCenterHeader.foreground',
    bg: 'notificationCenterHeader.background',
    base: 'notificationCenterHeader.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'notifications.foreground',
    bg: 'notifications.background',
    base: 'notifications.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'peekViewResult.fileForeground',
    bg: 'peekViewResult.background',
    base: 'peekViewResult.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'peekViewResult.lineForeground',
    bg: 'peekViewResult.background',
    base: 'peekViewResult.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'peekViewResult.selectionForeground',
    bg: 'peekViewResult.selectionBackground',
    base: 'peekViewResult.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'peekViewTitleDescription.foreground',
    bg: 'peekViewTitle.background',
    base: 'peekViewTitle.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'peekViewTitleLabel.foreground',
    bg: 'peekViewTitle.background',
    base: 'peekViewTitle.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editorSuggestWidget.foreground',
    bg: 'editorSuggestWidget.background',
    base: 'editorSuggestWidget.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editorSuggestWidget.highlightForeground',
    bg: 'editorSuggestWidget.background',
    base: 'editorSuggestWidget.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editorWidget.foreground',
    bg: 'editorWidget.background',
    base: 'editorWidget.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'terminal.foreground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'textLink.foreground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'textLink.activeForeground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'textPreformat.foreground',
    bg: 'textCodeBlock.background',
    base: 'textCodeBlock.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'settings.headerForeground',
    bg: 'editor.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'settings.numberInputForeground',
    bg: 'settings.numberInputBackground',
    base: 'settings.numberInputBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'settings.textInputForeground',
    bg: 'settings.textInputBackground',
    base: 'settings.textInputBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'settings.checkboxForeground',
    bg: 'settings.checkboxBackground',
    base: 'settings.checkboxBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'settings.dropdownForeground',
    bg: 'settings.dropdownBackground',
    base: 'settings.dropdownBackground',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'pickerGroup.foreground',
    bg: 'editorWidget.background',
    base: 'editorWidget.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'panelTitle.activeForeground',
    bg: 'panel.background',
    base: 'panel.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'panelTitle.inactiveForeground',
    bg: 'panel.background',
    base: 'panel.background',
    threshold: TEXT_THRESHOLD,
  },
]

const diagnosticsChecks = [
  {
    fg: 'editor.foreground',
    bg: 'editorError.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editor.foreground',
    bg: 'editorWarning.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
  {
    fg: 'editor.foreground',
    bg: 'editorInfo.background',
    base: 'editor.background',
    threshold: TEXT_THRESHOLD,
  },
]

const contrasts = ['hard', 'medium', 'soft']
const workbenches = ['material', 'flat', 'high-contrast']
const selections = ['grey', 'red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'purple']
const cursors = ['white', 'red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'purple']
const diagnosticOpacities = ['0%', '12.5%', '25%', '37.5%', '50%']
const highContrastFlags = [false, true]

const hexRegex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

const parseHex = (raw) => {
  if (typeof raw !== 'string' || !hexRegex.test(raw)) {
    return null
  }

  let hex = raw.slice(1)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
      .concat('ff')
  } else if (hex.length === 6) {
    hex = `${hex}ff`
  }

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
    a: Number.parseInt(hex.slice(6, 8), 16) / 255,
  }
}

const blend = (fg, bg) => {
  const alpha = fg.a + bg.a * (1 - fg.a)
  if (alpha === 0) {
    return { r: 0, g: 0, b: 0, a: 0 }
  }

  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
    a: alpha,
  }
}

const toLinear = (component) => {
  const normalized = component / 255
  if (normalized <= 0.03928) {
    return normalized / 12.92
  }

  return ((normalized + 0.055) / 1.055) ** 2.4
}

const luminance = (color) =>
  0.2126 * toLinear(color.r) + 0.7152 * toLinear(color.g) + 0.0722 * toLinear(color.b)

const contrastRatio = (a, b) => {
  const l1 = luminance(a)
  const l2 = luminance(b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const effectiveColor = (raw, base) => {
  const parsed = parseHex(raw)
  if (parsed === null) {
    return null
  }

  return parsed.a < 1 ? blend(parsed, base) : parsed
}

const formatConfig = (config) =>
  `contrast=${config.contrast} workbench=${config.workbench} selection=${config.selection} cursor=${config.cursor} diag=${config.diagnosticTextBackgroundOpacity} highContrast=${config.highContrast}`

const failures = []
const skipped = []
let checks = 0

const recordFailure = (kind, name, ratio, threshold, config) => {
  checks += 1
  if (ratio >= threshold) {
    return
  }

  failures.push({
    kind,
    name,
    ratio,
    threshold,
    config,
  })
}

const getEditorBackground = (colors) => {
  const editorBackgroundRaw = colors['editor.background']
  if (editorBackgroundRaw === undefined) {
    skipped.push('Missing editor.background for syntax/semantic checks')
    return null
  }

  const editorBackground = parseHex(editorBackgroundRaw)
  if (editorBackground === null) {
    skipped.push(`Invalid editor.background=${String(editorBackgroundRaw)}`)
    return null
  }

  return editorBackground
}

const runWorkbenchChecks = (colors, config) => {
  for (const pair of pairChecks) {
    const fgRaw = colors[pair.fg]
    const bgRaw = colors[pair.bg]
    const baseRaw = colors[pair.base] ?? colors['editor.background']

    if (fgRaw === undefined || bgRaw === undefined || baseRaw === undefined) {
      skipped.push(`Missing color key for ${pair.fg} on ${pair.bg}`)
      continue
    }

    const baseColor = parseHex(baseRaw)
    if (baseColor === null) {
      skipped.push(`Invalid base color ${pair.base}=${String(baseRaw)}`)
      continue
    }

    const bgColor = effectiveColor(bgRaw, baseColor)
    if (bgColor === null) {
      skipped.push(`Invalid background color ${pair.bg}=${String(bgRaw)}`)
      continue
    }

    const fgColor = effectiveColor(fgRaw, bgColor)
    if (fgColor === null) {
      skipped.push(`Invalid foreground color ${pair.fg}=${String(fgRaw)}`)
      continue
    }

    const ratio = contrastRatio(fgColor, bgColor)
    recordFailure('workbench', `${pair.fg} on ${pair.bg}`, ratio, pair.threshold, config)
  }
}

const runDiagnosticChecks = (colors, config) => {
  for (const pair of diagnosticsChecks) {
    const fgRaw = colors[pair.fg]
    const bgRaw = colors[pair.bg]
    const baseRaw = colors[pair.base]

    if (fgRaw === undefined || bgRaw === undefined || baseRaw === undefined) {
      skipped.push(`Missing diagnostic key for ${pair.fg} on ${pair.bg}`)
      continue
    }

    const baseColor = parseHex(baseRaw)
    if (baseColor === null) {
      skipped.push(`Invalid diagnostic base color ${pair.base}=${String(baseRaw)}`)
      continue
    }

    const bgColor = effectiveColor(bgRaw, baseColor)
    const fgColor = effectiveColor(fgRaw, bgColor)
    if (bgColor === null || fgColor === null) {
      skipped.push(`Invalid diagnostic color ${pair.fg} on ${pair.bg}`)
      continue
    }

    const ratio = contrastRatio(fgColor, bgColor)
    recordFailure('diagnostic', `${pair.fg} on ${pair.bg}`, ratio, pair.threshold, config)
  }
}

const runTokenChecks = (palette, colors, config) => {
  const editorBackground = getEditorBackground(colors)
  if (editorBackground === null) {
    return
  }

  const syntax = getSyntax(palette, config)
  for (const token of syntax) {
    const tokenForeground = token?.settings?.foreground
    if (tokenForeground === undefined) {
      continue
    }

    const fgColor = effectiveColor(tokenForeground, editorBackground)
    if (fgColor === null) {
      skipped.push(`Invalid syntax color for token ${String(token?.name)}`)
      continue
    }

    const ratio = contrastRatio(fgColor, editorBackground)
    recordFailure(
      'syntax',
      `tokenColors:${String(token?.name ?? '<unknown>')}`,
      ratio,
      TEXT_THRESHOLD,
      config,
    )
  }

  const semantic = getSemantic(palette)
  for (const [tokenName, tokenValue] of Object.entries(semantic)) {
    if (typeof tokenValue !== 'string') {
      continue
    }

    const fgColor = effectiveColor(tokenValue, editorBackground)
    if (fgColor === null) {
      skipped.push(`Invalid semantic color for token ${tokenName}`)
      continue
    }

    const ratio = contrastRatio(fgColor, editorBackground)
    recordFailure('semantic', `semantic:${tokenName}`, ratio, TEXT_THRESHOLD, config)
  }
}

const buildConfigs = () =>
  [
    ['contrast', contrasts],
    ['workbench', workbenches],
    ['selection', selections],
    ['cursor', cursors],
    ['diagnosticTextBackgroundOpacity', diagnosticOpacities],
    ['highContrast', highContrastFlags],
  ].reduce(
    (configs, [key, values]) =>
      configs.flatMap((config) => values.map((value) => ({ ...config, [key]: value }))),
    [{ italicKeywords: false, italicComments: true }],
  )

for (const config of buildConfigs()) {
  const palette = getPalette(config)
  const colors = getWorkbench(palette, config)

  runWorkbenchChecks(colors, config)
  runDiagnosticChecks(colors, config)
  runTokenChecks(palette, colors, config)
}

if (skipped.length > 0) {
  const uniqueSkipped = [...new Set(skipped)]
  console.error(`Skipped ${skipped.length} checks due to missing/invalid colors:`)
  for (const line of uniqueSkipped) {
    console.error(`- ${line}`)
  }
  process.exit(1)
}

if (failures.length > 0) {
  failures.sort((a, b) => a.ratio - b.ratio)
  console.error(
    `A11y contrast audit failed: ${failures.length} violations across ${checks} checks.`,
  )
  const maxPrinted = 200
  for (const failure of failures.slice(0, maxPrinted)) {
    console.error(
      `${failure.ratio.toFixed(2)} < ${failure.threshold.toFixed(1)} | ${failure.kind} | ${failure.name} | ${formatConfig(failure.config)}`,
    )
  }

  if (failures.length > maxPrinted) {
    console.error(`... ${failures.length - maxPrinted} additional violations not shown`)
  }

  process.exit(1)
}

console.log(`A11y contrast audit passed: ${checks} checks across all generated variants.`)
