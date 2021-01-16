#!/usr/bin/env node

const slugify = require('slugify');
const fs = require('fs');
const args = process.argv.slice(2);

function getDate() {
  let d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day];
}

const filename = slugify(
  getDate()
    .concat(args)
    .join(' ')
    .toLowerCase(),
);

console.log(filename);
fs.writeFileSync(`src/content/${filename}.markdown`, `---
title: ${args.join(' ')}
category: unfiled
---`);
