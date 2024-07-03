import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket } from '../src';

describe('SecureBucket EventBridgeEnabled Testing', () => {

  const stack = new Stack(new App(), 'TestingStack');

  const bucket = new SecureBucket(stack, 'SecureBucket', {
    bucketName: 'example-secure-bucket',
    eventBridgeEnabled: true,
  });

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should have EventBridge enabled', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      NotificationConfiguration: Match.objectEquals({
        EventBridgeConfiguration: {
          EventBridgeEnabled: true,
        },
      }),
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});