import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket } from '../src';

describe('SecureBucket Default Parameters Testing', () => {

  const app = new App();
  const stack = new Stack(app, 'TestingStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  const bucket = new SecureBucket(stack, 'SecureBucket');

  it('Is Bucket', async () => {
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

  it('Should match ownership', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      OwnershipControls: Match.objectEquals({
        Rules: [
          {
            ObjectOwnership: 'BucketOwnerEnforced',
          },
        ],
      }),
    });
  });

  it('Should match AccessControl is private', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      AccessControl: 'Private',
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot('default-secure-bucket');
  });
});
