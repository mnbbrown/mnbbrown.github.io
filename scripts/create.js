const slugify = require('slugify');
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
