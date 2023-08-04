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
npm install @gammarer/aws-secure-bucket
# or
yarn add @gammarer/aws-secure-bucket
```

### Python

```shell
pip install gammarer.aws-secure-bucket
```

### Java

Add the following to pom.xml:

```xml
<dependency>
  <groupId>com.gammarer</groupId>
  <artifactId>aws-secure-bucket</artifactId>
</dependency>
```

## Example

### TypeScript

```typescript
import { SecureBucket } from '@gammarer/aws-secure-bucket';

const bucket = new SecureBucket(stack, 'SecureBucket', {
  bucketName: 'example-secure-bucket',
});

```