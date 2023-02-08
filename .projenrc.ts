import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.61.0',
  defaultReleaseBranch: 'main',
  name: '@yicr/secure-bucket',
  description: 'This is a Simple S3 Secure Bucket.',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/secure-bucket.git',
  keywords: ['aws', 'cdk', 'aws-cdk', 's3', 'bucket'],
  npmAccess: javascript.NpmAccess.PUBLIC,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
});
project.synth();