# UsersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**usersControllerCreate**](UsersApi.md#userscontrollercreate) | **POST** /users | Create a user |
| [**usersControllerFindAll**](UsersApi.md#userscontrollerfindall) | **GET** /users | List all users (editor/admin only) |
| [**usersControllerFindOne**](UsersApi.md#userscontrollerfindone) | **GET** /users/{id} | Get a single user by id |
| [**usersControllerRemove**](UsersApi.md#userscontrollerremove) | **DELETE** /users/{id} | Delete your own user (or any user, as editor/admin) |
| [**usersControllerUpdate**](UsersApi.md#userscontrollerupdate) | **PATCH** /users/{id} | Update your own user (or any user, as editor/admin) |



## usersControllerCreate

> UserResponseDto usersControllerCreate(createUserDto)

Create a user

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsersApi(config);

  const body = {
    // CreateUserDto
    createUserDto: ...,
  } satisfies UsersControllerCreateRequest;

  try {
    const data = await api.usersControllerCreate(body);
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
| **createUserDto** | [CreateUserDto](CreateUserDto.md) |  | |

### Return type

[**UserResponseDto**](UserResponseDto.md)

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


## usersControllerFindAll

> Array&lt;UserResponseDto&gt; usersControllerFindAll()

List all users (editor/admin only)

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsersApi(config);

  try {
    const data = await api.usersControllerFindAll();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;UserResponseDto&gt;**](UserResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **403** | Viewers may not list users |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersControllerFindOne

> UserResponseDto usersControllerFindOne(id)

Get a single user by id

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsersApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies UsersControllerFindOneRequest;

  try {
    const data = await api.usersControllerFindOne(body);
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

[**UserResponseDto**](UserResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **404** | No user exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersControllerRemove

> usersControllerRemove(id)

Delete your own user (or any user, as editor/admin)

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsersApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies UsersControllerRemoveRequest;

  try {
    const data = await api.usersControllerRemove(body);
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
| **403** | You may only delete your own user |  -  |
| **404** | No user exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersControllerUpdate

> UserResponseDto usersControllerUpdate(id, body)

Update your own user (or any user, as editor/admin)

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsersApi(config);

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies UsersControllerUpdateRequest;

  try {
    const data = await api.usersControllerUpdate(body);
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

[**UserResponseDto**](UserResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **403** | You may only update your own user |  -  |
| **404** | No user exists with that id |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

