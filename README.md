# AWS Secure Bucket

This is a Simple S3 Secure Bucket.

- Bucket Access Control is Private
- Public Read Access is false
- Enforce SSL
- All Block public access
- Require encryption

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