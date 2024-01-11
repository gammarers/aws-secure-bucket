import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.80.0',
  jsiiVersion: '5.1.x',
  typescriptVersion: '5.1.x',
  defaultReleaseBranch: 'main',
  name: '@gammarer/aws-secure-bucket',
  description: 'This is a Simple S3 Secure Bucket.',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarer/aws-secure-bucket.git',
  keywords: ['aws', 'cdk', 'aws-cdk', 's3', 'bucket', 'secure', 'kms'],
  majorVersion: 1,
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '20.11.0',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 17 * * 0']), // every sunday (JST/MON:02:00)
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
  publishToPypi: {
    distName: 'gammarer.aws-secure-bucket',
    module: 'gammarer.aws_secure_bucket',
  },
  publishToMaven: {
    mavenGroupId: 'com.gammarer',
    javaPackage: 'com.gammarer.cdk.aws.secure_bucket',
    mavenArtifactId: 'aws-secure-bucket',
    mavenEndpoint: 'https://s01.oss.sonatype.org',
  },
  publishToNuget: {
    dotNetNamespace: 'Gammarer.CDK.AWS',
    packageId: 'Gammarer.CDK.AWS.SecureBucket',
  },
});
project.synth();