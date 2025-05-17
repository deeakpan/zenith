const hre = require('hardhat');

async function main() {
  console.log('Deploying ProjectRegistry contract...');

  // Deploy the contract
  const ProjectRegistry = await hre.ethers.getContractFactory('ProjectRegistry');
  const projectRegistry = await ProjectRegistry.deploy();
  await projectRegistry.waitForDeployment();
  const address = await projectRegistry.getAddress();
  console.log(`ProjectRegistry deployed to: ${address}`);

  // Initialize regions
  console.log('Initializing regions...');
  const regions = [
    'Finland',
    'Sweden',
    'Norway',
    'Denmark',
    'Iceland',
    'Estonia',
    'Latvia',
    'Lithuania',
    'Poland',
    'Germany',
    'Netherlands',
    'Belgium',
    'Luxembourg',
    'France',
    'Spain',
    'Portugal',
    'Italy',
    'Switzerland',
    'Austria',
    'Czech Republic',
    'Slovakia',
    'Hungary',
    'Romania',
    'Bulgaria',
    'Greece',
    'Cyprus',
    'Malta',
    'Ireland',
    'United Kingdom',
  ];

  const tx = await projectRegistry.initializeRegions(regions);
  await tx.wait();
  console.log('Regions initialized successfully!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
