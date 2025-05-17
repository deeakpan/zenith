import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying ProjectRegistry contract...');

  const ProjectRegistry = await ethers.getContractFactory('ProjectRegistry');
  const projectRegistry = await ProjectRegistry.deploy();

  await projectRegistry.waitForDeployment();

  const address = await projectRegistry.getAddress();
  console.log(`ProjectRegistry deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
