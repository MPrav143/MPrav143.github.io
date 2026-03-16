const parseDate = require('./utils/dateParser');

const tests = [
    "June '23 - Present",
    "july 2023 to aug 2023",
    "sep 2024 to october 2024",
    "2024",
    "Oct 2023",
    "Present",
    "Current"
];

tests.forEach(t => {
    console.log(`"${t}" ->`, parseDate(t));
});
