import { DefaultStackSynthesizer, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

/**
 * @TODO: Not yet supported
 * https://github.com/aws/jsii/issues/4468
 * type omitKeys = 'publicReadAccess|enforceSSL|blockPublicAccess';
 * export interface CodePipelineStateChangeDetectionEventRuleProps extends Omit<s3.BucketProps, 'publicReadAccess'> {}
 */

export interface SecureBucketProps extends s3.BucketProps {

  /**
   * If you are setting a custom Qualifier and using it as the artifact bucket for the CDK pipeline, set it to true.
   *
   * @default false
   */
  readonly isPipelineArtifactBucket?: boolean;

  /**
   * If your are using it as the CloudFront orign bucket, set it to true.
   */
  readonly isCloudFrontOriginBucket?: boolean;
}

export class SecureBucket extends s3.Bucket {
  constructor(scope: Construct, id: string, props?: SecureBucketProps) {
    super(scope, id, {
      ...props,
      removalPolicy: RemovalPolicy.RETAIN,
      // encryption: props?.encryption || s3.BucketEncryption.KMS_MANAGED,
      encryption: (() => {
        if (props?.isCloudFrontOriginBucket === true) {
          return s3.BucketEncryption.S3_MANAGED;
        }
        return props?.encryption || s3.BucketEncryption.KMS_MANAGED;
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

    // 👇 Get account & region
    const account = Stack.of(this).account;
    const region = Stack.of(this).region;

    if (props?.isPipelineArtifactBucket) {

      // 👇 Get qualifier
      // const qualifier = Stack.of(this).synthesizer.bootstrapQualifier || defaultQualifier;
      const qualifier = Stack.of(this).synthesizer.bootstrapQualifier;

      // add resource policy when custom qualifier
      if (qualifier && (qualifier != DefaultStackSynthesizer.DEFAULT_QUALIFIER)) {

        this.addToResourcePolicy(new iam.PolicyStatement({
          actions: [
            's3:*',
          ],
          resources: [
            `${this.bucketArn}`,
            `${this.bucketArn}/*`,
          ],
          principals: [
            new iam.ArnPrincipal(`arn:aws:iam::${account}:role/cdk-${qualifier}-deploy-role-${account}-${region}`),
          ],
        }));
      }
    }
  }
}