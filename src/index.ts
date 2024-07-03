import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface SecureBucketProps extends s3.BucketProps {}

export class SecureBucket extends s3.Bucket {
  constructor(scope: Construct, id: string, props?: SecureBucketProps) {
    super(scope, id, {
      ...props,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: (() => {
        if (!props?.encryption) {
          return s3.BucketEncryption.KMS_MANAGED;
        } else {
          if (props.encryption === s3.BucketEncryption.UNENCRYPTED) {
            throw new Error('DeplicatedArgumentFoundError: BucketEncryption.UNENCRYPTED is deplicated, Bucket cano not be unencrypted.');
          }
        }
        return props.encryption;
      })(),
      accessControl: (() => {
        if (!props?.accessControl) {
          return s3.BucketAccessControl.PRIVATE;
        }
        return props.accessControl;
      })(),
      eventBridgeEnabled: undefined,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: props?.versioned !== undefined ? props.versioned : true,
      objectOwnership: (() => {
        if (props?.objectOwnership) {
          return props.objectOwnership;
        }
        return s3.ObjectOwnership.BUCKET_OWNER_ENFORCED;
      })(),
    });

    // Get CfnBucket
    const cfnBucket = this.node.defaultChild as s3.CfnBucket;
    if (props?.eventBridgeEnabled === true) {
      cfnBucket.addPropertyOverride('NotificationConfiguration.EventBridgeConfiguration.EventBridgeEnabled', true);
    }
  }
}