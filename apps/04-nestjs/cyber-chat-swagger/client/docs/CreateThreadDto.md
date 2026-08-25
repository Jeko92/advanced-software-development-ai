
# CreateThreadDto


## Properties

Name | Type
------------ | -------------
`title` | string
`body` | string

## Example

```typescript
import type { CreateThreadDto } from ''

// TODO: Update the object below with actual values
const example = {
  "title": Best encryption algorithm?,
  "body": AES-256 vs ChaCha20 — what would you run in production?,
} satisfies CreateThreadDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateThreadDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


