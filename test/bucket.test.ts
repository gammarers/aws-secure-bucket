import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket, SecureBucketEncryption } from '../src';

describe('SecureBucket Testing', () => {

  describe('SecureBucket Default Parameters Testing', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const bucket = new SecureBucket(stack, 'SecureBucket');

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    const template = Template.fromStack(stack);

    it('Should have encryption', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: Match.objectEquals({
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'aws:kms',
              },
            },
          ],
        }),
      });
    });

    it('Should block public access', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: Match.objectEquals({
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        }),
      });
    });

    it('Should versioning enabled', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        VersioningConfiguration: Match.objectEquals({
          Status: 'Enabled',
        }),
      });
    });

    it('Should enforce SSL', () => {
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 's3:*',
              Condition: {
                Bool: {
                  'aws:SecureTransport': 'false',
                },
              },
              Effect: 'Deny',
              Principal: {
                AWS: '*',
              },
            }),
          ]),
        },
      });
    });
    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('default-secure-bucket');
    });
  });
  describe('SecureBucket Encryption S3 Managed Testing', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack');
    const bucket = new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      encryption: SecureBucketEncryption.S3_MANAGED,
    });

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    const template = Template.fromStack(stack);

    it('Should have encryption', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: Match.objectEquals({
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256',
              },
            },
          ],
        }),
      });
    });

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('encryption-s3-managed-bucket');
    });
  });

  describe('SecureBucket Encryption KMS Managed Testing', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack');
    const bucket = new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      encryption: SecureBucketEncryption.KMS_MANAGED,
      versioned: true,
    });

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    const template = Template.fromStack(stack);

    it('Should have encryption', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: Match.objectEquals({
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'aws:kms',
              },
            },
          ],
        }),
      });
    });

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('encryption-kms-managed-bucket');
    });
  });

  describe('SecureBucket No Versioning Testing', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack');
    const bucket = new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      encryption: SecureBucketEncryption.KMS_MANAGED,
      versioned: false,
    });

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    const template = Template.fromStack(stack);

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('no-versioning-bucket');
    });
  });
});