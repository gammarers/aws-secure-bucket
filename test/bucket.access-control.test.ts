import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket } from '../src';

describe('SecureBucket AccessControl Testing', () => {

  const stack = new Stack(new App(), 'TestingStack');

  const bucket = new SecureBucket(stack, 'SecureBucket', {
    bucketName: 'example-secure-bucket',
    accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
  });

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should have AccessControl private', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      AccessControl: 'BucketOwnerFullControl',
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});