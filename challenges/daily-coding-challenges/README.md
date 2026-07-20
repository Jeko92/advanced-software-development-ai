# Daily Coding Challenge

Practice your coding skills, one challenge per day.

## Setup

Install the dependencies:

```bash
npm i
```

## Usage

To get a new challenge, run:

```bash
npm run next
```

You can specify the difficulty or kyu level (8 is simple, 4 is hard):

```bash
npm run next easy
npm run next {4,5,6,7,8}
npm run next hard
```

You can run your code by using bun, tsx or the following npm script:

```bash
npm run try challenges/{challenge-name}.ts
```

To get the solution for a given challenge, run:

```bash
npm run solution {challenge-name}
npm run solution alphabetical-addition
```

Challenges can't be picked twice, to reset the cache, run:

```bash
npm run reset
```

Happy Hacking!
