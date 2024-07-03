import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket } from '../src';

describe('SecureBucket Encryption Testing', () => {

  describe('SecureBucket Encryption S3 Managed Testing', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack');
    const bucket = new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    const template = Template.fromStack(stack);

    it('Should have encryption sse algorithm aes256', () => {
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
      expect(template.toJSON()).toMatchSnapshot('encryption-s3-managed');
    });
  });

  describe('SecureBucket Encryption KMS Managed Testing', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack');
    const bucket = new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      encryption: s3.BucketEncryption.KMS_MANAGED,
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
      expect(template.toJSON()).toMatchSnapshot('encryption-kms-managed');
    });
  });

  describe('SecureBucket Encryption Unencryption Error Testing', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack');

    it('Should Error', () => {
      expect(() => {
        new SecureBucket(stack, 'SecureBucket', {
          bucketName: 'example-secure-bucket',
          encryption: s3.BucketEncryption.UNENCRYPTED,
        });
      }).toThrow(/DeplicatedArgumentFoundError: BucketEncryption.UNENCRYPTED is deplicated, Bucket cano not be unencrypted./);
    });

  });

});