#!/usr/bin/env node
// Server-rendered component regression checks; does not replace a visual browser review.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const file = path.resolve(__dirname, '../components/diamond/custom-slider.tsx');
const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
});
const componentModule = new Module(file, module);
componentModule.filename = file;
componentModule.paths = Module._nodeModulePaths(path.dirname(file));
componentModule._compile(compiled.outputText, file);
const Slider = componentModule.exports.default;

const cases = [
  ['normal range', { min: 0, max: 10, value: [2, 8] }, [20, 80]],
  ['stale carat maximum is bounded', { min: 0.18, max: 12.27, value: [1.81, 31] }, [((1.81 - 0.18) / (12.27 - 0.18)) * 100, 100]],
  ['values below and above bounds', { min: 0, max: 10, value: [-5, 100] }, [0, 100]],
  ['reversed values produce no negative track', { min: 0, max: 10, value: [8, 2] }, [80, 80]],
  ['zero range has no division by zero', { min: 1, max: 1, value: [0, 31] }, [0, 0]],
  ['nonfinite values are bounded', { min: 0, max: 10, value: [NaN, Infinity] }, [0, 0]],
];
for (const [name, props, expected] of cases) {
  const html = renderToStaticMarkup(React.createElement(Slider, { ...props, onChange() {} }));
  const percentages = [...html.matchAll(/left:([^;%]+)%/g)].map(match => Number(match[1]));
  const widths = [...html.matchAll(/width:([^;%]+)%/g)].map(match => Number(match[1]));
  assert.equal(percentages.length, 3); // filled track and both handles
  assert(percentages.every(value => Number.isFinite(value) && value >= 0 && value <= 100));
  assert(widths.every(value => Number.isFinite(value) && value >= 0 && value <= 100));
  assert(Math.abs(percentages[1] - expected[0]) < 0.00001);
  assert(Math.abs(percentages[2] - expected[1]) < 0.00001);
  console.log(`PASS Slider: ${name}`);
}
console.log(`${cases.length} slider rendering checks passed.`);
