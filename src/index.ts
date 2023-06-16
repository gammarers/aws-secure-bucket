import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface SecureBucketProps {
  readonly bucketName?: string;
  readonly encryption?: SecureBucketEncryption;
  readonly versioned?: boolean;
  readonly eventBridgeEnabled?: boolean;
}

export enum SecureBucketEncryption {
  /**
   * Server-side KMS encryption with a master key managed by KMS.
   */
  KMS_MANAGED = 'KMS_MANAGED',
  /**
   * Server-side encryption with a master key managed by S3.
   */
  S3_MANAGED = 'S3_MANAGED',
}

export class SecureBucket extends s3.Bucket {
  constructor(scope: Construct, id: string, props?: SecureBucketProps) {
    super(scope, id, {
      bucketName: props?.bucketName,
      accessControl: s3.BucketAccessControl.PRIVATE,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: (() => {
        if (props?.encryption) {
          switch (props.encryption) {
            case SecureBucketEncryption.KMS_MANAGED:
              return s3.BucketEncryption.KMS_MANAGED;
            case SecureBucketEncryption.S3_MANAGED:
              return s3.BucketEncryption.S3_MANAGED;
          }
        }
        return s3.BucketEncryption.KMS_MANAGED;
      })(),
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: props?.versioned ? props.versioned : true,
    });

    // Get CfnBucket
    const cfnBucket = this.node.defaultChild as s3.CfnBucket;
    if (props?.eventBridgeEnabled === true) {
      cfnBucket.addPropertyOverride('NotificationConfiguration.EventBridgeConfiguration.EventBridgeEnabled', true);
    }

    // todo: cloudTrailEnabled
    // const trail = new cloudtrail.Trail(this, 'Trail');
    // trail.addS3EventSelector([{ bucket: this }], {
    //   readWriteType: cloudtrail.ReadWriteType.ALL,
    // });
  }
}