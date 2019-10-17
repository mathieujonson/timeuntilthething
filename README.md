## Notes and Processes

#### For each region and environment, you have to bootstrap it:

- `cdk bootstrap aws://${ACCOUNT}/${REGION}`

#### Helpful to have an NPM script to combine some things: 

- "deploy:east": "npm run build && cdk deploy TuttInfrastructureStackEast"
- "deploy:west": "npm run build && cdk deploy TuttInfrastructureStackWest"
- "deploy:shared": "npm run build && cdk deploy TuttSharedStack"

#### Manual Steps

- Making the table Global was done in the Console. There's an experimental thing in CDK that could have done it, but it's still in Beta.
- Registering the domain, but I'm pretty sure that can't be automated.
- SSL certs were added via the Console, with the necessary CNAME records added to confirm ownership.
