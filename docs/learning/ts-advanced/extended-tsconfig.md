# TypeScript Advanced Setup - Extended tsconfig

The tsconfig that we use at the moment works. But we can extend it to add ground rules about coding rules rather than just the compile behavior. This includes how to handle unused variables and handling of edge cases.

## Coding Rules Configuration

We can add a new rule to the tsconfig file to control how unused variables are handled:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",

    "target": "esnext",
    "lib": ["esnext"],
    "types": [],
    "module": "esnext",

    "esModuleInterop": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "skipLibCheck": true,

    // coding rules
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

These new rules will force everyone in the team to follow the same coding rules, so the team can work together without conflicts. The following rules are enabled:

- `strict`: Enforce strict type-checking rules.
- `noUnusedLocals`: Unused variables are considered errors and prevent compilation.
- `noUnusedParameters`: The same applies to function parameters.
- `noFallthroughCasesInSwitch`: Report errors for fallthrough cases in switch statements.
- `forceConsistentCasingInFileNames`: Enforces consistent casing in file names.

## Resources

[TSConfig Compiler Options](https://www.typescriptlang.org/tsconfig/#compilerOptions)
