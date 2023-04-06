# AWS Secure Bucket

This is a Simple S3 Secure Bucket.


## Install

### TypeScript

```shell
npm install @yicr/aws-secure-bucket
```
or
```shell
yarn add @yicr/aws-secure-bucket
```

## Example

### TypeScript

```shell
npm install @yicr/aws-secure-bucket
```

```typescript
import { SecureBucket } from '@yicr/aws-secure-bucket';

const bucket = new SecureBucket(stack, 'SecureBucket', {
  bucketName: 'example-secure-bucket',
});

```