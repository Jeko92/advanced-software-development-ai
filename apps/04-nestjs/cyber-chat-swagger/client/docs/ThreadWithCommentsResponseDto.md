
# ThreadWithCommentsResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`body` | string
`authorId` | string
`author` | string
`createdAt` | Date
`comments` | [Array&lt;CommentResponseDto&gt;](CommentResponseDto.md)

## Example

```typescript
import type { ThreadWithCommentsResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": Best encryption algorithm?,
  "body": AES-256 vs ChaCha20 — what would you run in production?,
  "authorId": null,
  "author": admin,
  "createdAt": null,
  "comments": null,
} satisfies ThreadWithCommentsResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ThreadWithCommentsResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


