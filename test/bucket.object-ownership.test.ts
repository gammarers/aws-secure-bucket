import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket } from '../src';

describe('SecureBucket ObjectOwnership Testing', () => {

  const stack = new Stack(new App(), 'TestingStack');

  const bucket = new SecureBucket(stack, 'SecureBucket', {
    bucketName: 'example-secure-bucket',
    objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
  });

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should match ownership', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      OwnershipControls: Match.objectEquals({
        Rules: [
          {
            ObjectOwnership: 'BucketOwnerPreferred',
          },
        ],
      }),
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});