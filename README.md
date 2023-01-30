# Secure Bucket

This is a Simple S3 Secure Bucket.


## Install

### TypeScript

```shell
npm install @yicr/secure-bucket
```
or
```shell
yarn @yicr/secure-bucket
```

## Example

### TypeScript

```shell
npm install @yicr/secure-bucket
```

```typescript
import { SecureBucket } from '@yicr/secure-bucket';

const bucket = new SecureBucket(stack, 'SecureBucket', {
  bucketName: 'example-secure-bucket',
});

```