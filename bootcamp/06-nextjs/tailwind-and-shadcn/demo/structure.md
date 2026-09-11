# Component structure sketch

```tsx
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Loading />}>
    <Layout>
      <Page params={Promise({ menuId: "1" })} /> // called service ~ 2s
    </Layout>
  </Suspense>
</ErrorBoundary>;
```
