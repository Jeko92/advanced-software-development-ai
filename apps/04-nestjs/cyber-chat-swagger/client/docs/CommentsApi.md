# CommentsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**commentsControllerGetOne**](CommentsApi.md#commentscontrollergetone) | **GET** /comments/{id} | Get a single comment by id |
| [**commentsControllerRemove**](CommentsApi.md#commentscontrollerremove) | **DELETE** /comments/{id} | Delete a comment you own |
| [**commentsControllerUpdate**](CommentsApi.md#commentscontrollerupdate) | **PATCH** /comments/{id} | Update a comment you own |



## commentsControllerGetOne

> CommentResponseDto commentsControllerGetOne(id)

Get a single comment by id

### Example

```ts
import {
  Configuration,
  CommentsApi,
} from '';
import type { CommentsControllerGetOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CommentsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies CommentsControllerGetOneRequest;

  try {
    const data = await api.commentsControllerGetOne(body);
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

[**CommentResponseDto**](CommentResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **404** | No comment exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## commentsControllerRemove

> commentsControllerRemove(id)

Delete a comment you own

### Example

```ts
import {
  Configuration,
  CommentsApi,
} from '';
import type { CommentsControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CommentsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies CommentsControllerRemoveRequest;

  try {
    const data = await api.commentsControllerRemove(body);
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
| **403** | You do not own this comment |  -  |
| **404** | No comment exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## commentsControllerUpdate

> CommentResponseDto commentsControllerUpdate(id, body)

Update a comment you own

### Example

```ts
import {
  Configuration,
  CommentsApi,
} from '';
import type { CommentsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CommentsApi(config);

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies CommentsControllerUpdateRequest;

  try {
    const data = await api.commentsControllerUpdate(body);
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

[**CommentResponseDto**](CommentResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **403** | You do not own this comment |  -  |
| **404** | No comment exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

