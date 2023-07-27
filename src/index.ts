import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface SecureBucketProps {
  readonly bucketName?: string;
  readonly encryption?: SecureBucketEncryption;
  readonly versioned?: boolean;
  readonly eventBridgeEnabled?: boolean;
  readonly lifecycleRules?: s3.LifecycleRule[];
  readonly objectOwnership?: SecureObjectOwnership;
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

/**
 * The ObjectOwnership of the bucket.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/about-object-ownership.html
 *
 */
export enum SecureObjectOwnership {
  /**
   * ACLs are disabled, and the bucket owner automatically owns
   * and has full control over every object in the bucket.
   * ACLs no longer affect permissions to data in the S3 bucket.
   * The bucket uses policies to define access control.
   */
  BUCKET_OWNER_ENFORCED = 'BucketOwnerEnforced',
  /**
   * Objects uploaded to the bucket change ownership to the bucket owner .
   */
  BUCKET_OWNER_PREFERRED = 'BucketOwnerPreferred',
  /**
   * The uploading account will own the object.
   */
  OBJECT_WRITER = 'ObjectWriter'
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
      lifecycleRules: props?.lifecycleRules,
      objectOwnership: (() => {
        if (props?.objectOwnership) {
          switch (props.objectOwnership) {
            case SecureObjectOwnership.BUCKET_OWNER_ENFORCED:
              return s3.ObjectOwnership.BUCKET_OWNER_ENFORCED;
            case SecureObjectOwnership.BUCKET_OWNER_PREFERRED:
              return s3.ObjectOwnership.BUCKET_OWNER_PREFERRED;
            case SecureObjectOwnership.OBJECT_WRITER:
              return s3.ObjectOwnership.OBJECT_WRITER;
          }
        }
        return s3.ObjectOwnership.BUCKET_OWNER_ENFORCED;
      })(),
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