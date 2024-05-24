# AWS Secure Bucket

[![GitHub](https://img.shields.io/github/license/gammarers/aws-secure-bucket?style=flat-square)](https://github.com/gammarers/aws-secure-bucket/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarers/aws-secure-bucket?style=flat-square)](https://www.npmjs.com/package/@gammarers/aws-secure-bucket)
[![PyPI](https://img.shields.io/pypi/v/gammarers.aws-secure-bucket?style=flat-square)](https://pypi.org/project/gammarers.aws-secure-bucket/)
[![Nuget](https://img.shields.io/nuget/v/Gammarers.CDK.AWS.SecureBucket?style=flat-square)](https://www.nuget.org/packages/Gammarers.CDK.AWS.SecureBucket/)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers/aws-secure-bucket/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarers/aws-secure-bucket/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarers/aws-secure-bucket?sort=semver&style=flat-square)](https://github.com/gammarers/aws-secure-bucket/releases)

[![View on Construct Hub](https://constructs.dev/badge?package=@gammarers/aws-secure-bucket)](https://constructs.dev/packages/@gammarers/aws-secure-bucket)

This is a Simple S3 Secure Bucket.

- Bucket Access Control is Private
- Public Read Access is false
- Enforce SSL
- All Block public access
- Require encryption

## Install

### TypeScript

```shell
npm install @gammarers/aws-secure-bucket
```
or
```shell
yarn add @gammarers/aws-secure-bucket
```
or
```shell
pnpm add @gammarers/aws-secure-bucket
```
or
```shell
bun add @gammarers/aws-secure-bucket
```

### Python

```shell
pip install gammarers.aws-secure-bucket
```

### C# / .Net

```shell
dotnet add package Gammarers.CDK.AWS.SecureBucket
```

## Example

```typescript
import { SecureBucket } from '@gammarers/aws-secure-bucket';

const bucket = new SecureBucket(stack, 'SecureBucket', {
  bucketName: 'example-secure-bucket',
});

```
