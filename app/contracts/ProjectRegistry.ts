import { ethers } from 'ethers';
import ProjectRegistryABI from './ProjectRegistry.json';

export interface Project {
  name: string;
  projectType: string;
  imageCID: string;
  dataCID: string;
  owner: string;
  timestamp: number;
  price: number;
  regions: string[];
}

export class ProjectRegistryContract {
  private contract: ethers.Contract;

  constructor(address: string, provider: ethers.Provider) {
    if (!ProjectRegistryABI) {
      throw new Error('ProjectRegistry ABI not loaded correctly');
    }

    try {
      this.contract = new ethers.Contract(
        address,
        ProjectRegistryABI,
        provider
      );
    } catch (error) {
      console.error('Error initializing contract:', error);
      throw new Error('Failed to initialize contract with provided ABI');
    }
  }

  async registerProject(
    name: string,
    projectType: string,
    imageCID: string,
    dataCID: string,
    regions: string[],
    price: bigint,
    signer: ethers.Signer
  ) {
    try {
      const contractWithSigner = this.contract.connect(signer);
      const tx = await contractWithSigner.registerProject(
        name,
        projectType,
        imageCID,
        dataCID,
        regions,
        { value: price }
      );
      return tx;
    } catch (error) {
      console.error('Error registering project:', error);
      throw error;
    }
  }

  async getAllRegionsStatus() {
    return this.contract.getAllRegionsStatus();
  }

  async getProject(name: string) {
    return this.contract.getProject(name);
  }

  async getProjectCount() {
    return this.contract.getProjectCount();
  }

  async getAllProjects() {
    return this.contract.getAllProjects();
  }

  async areRegionsAvailable(regions: string[]) {
    if (!Array.isArray(regions) || regions.length === 0) {
      throw new Error('Invalid regions array');
    }
    return this.contract.areRegionsAvailable(regions);
  }
}
