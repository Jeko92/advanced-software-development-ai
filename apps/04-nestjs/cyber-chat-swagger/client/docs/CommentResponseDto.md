
# CommentResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`threadId` | string
`body` | string
`authorId` | string
`author` | string
`createdAt` | Date

## Example

```typescript
import type { CommentResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "threadId": null,
  "body": ChaCha20, no contest.,
  "authorId": null,
  "author": admin,
  "createdAt": null,
} satisfies CommentResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CommentResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


