import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { SecureBucket, SecureObjectOwnership } from '../src';

describe('SecureBucket ObjectOwnership Testing', () => {

  describe('ObjectOwnership is Bucket Owner Enforced (ACL disabled)', () => {

    const stack = new Stack(new App(), 'TestingStack');

    new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      objectOwnership: SecureObjectOwnership.BUCKET_OWNER_ENFORCED,
    });

    const template = Template.fromStack(stack);

    it('Should have Ownership Controls', async () => {
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

    it('Should match snapshot', async () => {
      expect(template.toJSON()).toMatchSnapshot();
    });
  });

  describe('ObjectOwnership is Bucket Owner Preferred', () => {

    const stack = new Stack(new App(), 'TestingStack');

    new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      objectOwnership: SecureObjectOwnership.BUCKET_OWNER_PREFERRED,
    });

    const template = Template.fromStack(stack);

    it('Should have Ownership Controls', async () => {
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

    it('Should match snapshot', async () => {
      expect(template.toJSON()).toMatchSnapshot();
    });
  });

  describe('ObjectOwnership is Object Write', () => {

    const stack = new Stack(new App(), 'TestingStack');

    new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      objectOwnership: SecureObjectOwnership.OBJECT_WRITER,
    });

    const template = Template.fromStack(stack);

    it('Should have EventBridge enabled', async () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        OwnershipControls: Match.objectEquals({
          Rules: [
            {
              ObjectOwnership: 'ObjectWriter',
            },
          ],
        }),
      });
    });

    it('Should match snapshot', async () => {
      expect(template.toJSON()).toMatchSnapshot();
    });
  });
});