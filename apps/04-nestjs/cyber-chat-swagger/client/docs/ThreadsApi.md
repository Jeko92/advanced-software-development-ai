# ThreadsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**threadsControllerAddComment**](ThreadsApi.md#threadscontrolleraddcomment) | **POST** /threads/{id}/comments | Add a comment to a thread |
| [**threadsControllerCreate**](ThreadsApi.md#threadscontrollercreate) | **POST** /threads | Start a new thread |
| [**threadsControllerGetAll**](ThreadsApi.md#threadscontrollergetall) | **GET** /threads | List threads, paginated and optionally filtered |
| [**threadsControllerGetOne**](ThreadsApi.md#threadscontrollergetone) | **GET** /threads/{id} | Get a single thread with its comments |
| [**threadsControllerRemove**](ThreadsApi.md#threadscontrollerremove) | **DELETE** /threads/{id} | Delete a thread you own |
| [**threadsControllerUpdate**](ThreadsApi.md#threadscontrollerupdate) | **PATCH** /threads/{id} | Update a thread you own |



## threadsControllerAddComment

> CommentResponseDto threadsControllerAddComment(id, createCommentDto)

Add a comment to a thread

### Example

```ts
import {
  Configuration,
  ThreadsApi,
} from '';
import type { ThreadsControllerAddCommentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ThreadsApi(config);

  const body = {
    // string
    id: id_example,
    // CreateCommentDto
    createCommentDto: ...,
  } satisfies ThreadsControllerAddCommentRequest;

  try {
    const data = await api.threadsControllerAddComment(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **createCommentDto** | [CreateCommentDto](CreateCommentDto.md) |  | |

### Return type

[**CommentResponseDto**](CommentResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **400** | Validation failed |  -  |
| **404** | No thread exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## threadsControllerCreate

> ThreadResponseDto threadsControllerCreate(createThreadDto)

Start a new thread

### Example

```ts
import {
  Configuration,
  ThreadsApi,
} from '';
import type { ThreadsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ThreadsApi(config);

  const body = {
    // CreateThreadDto
    createThreadDto: ...,
  } satisfies ThreadsControllerCreateRequest;

  try {
    const data = await api.threadsControllerCreate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createThreadDto** | [CreateThreadDto](CreateThreadDto.md) |  | |

### Return type

[**ThreadResponseDto**](ThreadResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **400** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## threadsControllerGetAll

> PaginatedThreadsResponseDto threadsControllerGetAll(page, limit, sort, author, startDate)

List threads, paginated and optionally filtered

### Example

```ts
import {
  Configuration,
  ThreadsApi,
} from '';
import type { ThreadsControllerGetAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ThreadsApi(config);

  const body = {
    // number | Page number (default 1) (optional)
    page: 8.14,
    // number | Page size, 1-100 (default 10) (optional)
    limit: 8.14,
    // 'createdAt' | '-createdAt' (optional)
    sort: sort_example,
    // string | Filter by author username (optional)
    author: author_example,
    // Date | ISO date; only threads created on or after this date (optional)
    startDate: 2013-10-20T19:20:30+01:00,
  } satisfies ThreadsControllerGetAllRequest;

  try {
    const data = await api.threadsControllerGetAll(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` | Page number (default 1) | [Optional] [Defaults to `1`] |
| **limit** | `number` | Page size, 1-100 (default 10) | [Optional] [Defaults to `10`] |
| **sort** | `createdAt`, `-createdAt` |  | [Optional] [Defaults to `undefined`] [Enum: createdAt, -createdAt] |
| **author** | `string` | Filter by author username | [Optional] [Defaults to `undefined`] |
| **startDate** | `Date` | ISO date; only threads created on or after this date | [Optional] [Defaults to `undefined`] |

### Return type

[**PaginatedThreadsResponseDto**](PaginatedThreadsResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## threadsControllerGetOne

> ThreadWithCommentsResponseDto threadsControllerGetOne(id)

Get a single thread with its comments

### Example

```ts
import {
  Configuration,
  ThreadsApi,
} from '';
import type { ThreadsControllerGetOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ThreadsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies ThreadsControllerGetOneRequest;

  try {
    const data = await api.threadsControllerGetOne(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ThreadWithCommentsResponseDto**](ThreadWithCommentsResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **404** | No thread exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## threadsControllerRemove

> threadsControllerRemove(id)

Delete a thread you own

### Example

```ts
import {
  Configuration,
  ThreadsApi,
} from '';
import type { ThreadsControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ThreadsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies ThreadsControllerRemoveRequest;

  try {
    const data = await api.threadsControllerRemove(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |
| **403** | You do not own this thread |  -  |
| **404** | No thread exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## threadsControllerUpdate

> ThreadResponseDto threadsControllerUpdate(id, body)

Update a thread you own

### Example

```ts
import {
  Configuration,
  ThreadsApi,
} from '';
import type { ThreadsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ThreadsApi(config);

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies ThreadsControllerUpdateRequest;

  try {
    const data = await api.threadsControllerUpdate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **body** | `object` |  | |

### Return type

[**ThreadResponseDto**](ThreadResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **403** | You do not own this thread |  -  |
| **404** | No thread exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

