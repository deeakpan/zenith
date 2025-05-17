// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ProjectRegistry is Ownable {
    struct Project {
        string name;
        string projectType;
        string imageCID;
        string dataCID;
        address owner;
        uint256 timestamp;
        uint256 price;
        string[] regions;
    }

    struct Region {
        bool isTaken;
        string projectName;
    }

    // Mapping from project name to Project struct
    mapping(string => Project) public projects;
    
    // Mapping from region name to Region struct
    mapping(string => Region) public regions;
    
    // Array to keep track of all project names
    string[] public projectNames;

    event ProjectRegistered(
        string name,
        string projectType,
        string imageCID,
        string dataCID,
        address owner,
        uint256 timestamp,
        uint256 price,
        string[] regions
    );

    event RegionUpdated(
        string name,
        bool isTaken,
        string projectName
    );

    constructor() Ownable(msg.sender) {
        // Initialize regions
        regions["Finland"] = Region({ isTaken: false, projectName: "" });
        regions["Sweden"] = Region({ isTaken: false, projectName: "" });
        regions["Norway"] = Region({ isTaken: false, projectName: "" });
        regions["Denmark"] = Region({ isTaken: false, projectName: "" });
        regions["Iceland"] = Region({ isTaken: false, projectName: "" });
        regions["Estonia"] = Region({ isTaken: false, projectName: "" });
        regions["Latvia"] = Region({ isTaken: false, projectName: "" });
        regions["Lithuania"] = Region({ isTaken: false, projectName: "" });
        regions["Poland"] = Region({ isTaken: false, projectName: "" });
        regions["Germany"] = Region({ isTaken: false, projectName: "" });
        regions["Netherlands"] = Region({ isTaken: false, projectName: "" });
        regions["Belgium"] = Region({ isTaken: false, projectName: "" });
        regions["Luxembourg"] = Region({ isTaken: false, projectName: "" });
        regions["France"] = Region({ isTaken: false, projectName: "" });
        regions["Spain"] = Region({ isTaken: false, projectName: "" });
        regions["Portugal"] = Region({ isTaken: false, projectName: "" });
        regions["Italy"] = Region({ isTaken: false, projectName: "" });
        regions["Switzerland"] = Region({ isTaken: false, projectName: "" });
        regions["Austria"] = Region({ isTaken: false, projectName: "" });
        regions["Czech Republic"] = Region({ isTaken: false, projectName: "" });
        regions["Slovakia"] = Region({ isTaken: false, projectName: "" });
        regions["Hungary"] = Region({ isTaken: false, projectName: "" });
        regions["Romania"] = Region({ isTaken: false, projectName: "" });
        regions["Bulgaria"] = Region({ isTaken: false, projectName: "" });
        regions["Greece"] = Region({ isTaken: false, projectName: "" });
        regions["Cyprus"] = Region({ isTaken: false, projectName: "" });
        regions["Malta"] = Region({ isTaken: false, projectName: "" });
        regions["Ireland"] = Region({ isTaken: false, projectName: "" });
        regions["United Kingdom"] = Region({ isTaken: false, projectName: "" });
    }

    function areRegionsAvailable(string[] memory _regions) external view returns (bool[] memory) {
        bool[] memory availability = new bool[](_regions.length);
        for (uint i = 0; i < _regions.length; i++) {
            availability[i] = !regions[_regions[i]].isTaken;
        }
        return availability;
    }

    function getAllRegionsStatus() external view returns (
        string[] memory takenRegions,
        string[] memory ownerProjects
    ) {
        uint256 takenCount = 0;
        
        // First count how many regions are taken
        for (uint i = 0; i < projectNames.length; i++) {
            Project memory project = projects[projectNames[i]];
            takenCount += project.regions.length;
        }

        // Initialize arrays
        takenRegions = new string[](takenCount);
        ownerProjects = new string[](takenCount);
        
        // Fill arrays
        uint256 index = 0;
        for (uint i = 0; i < projectNames.length; i++) {
            Project memory project = projects[projectNames[i]];
            for (uint j = 0; j < project.regions.length; j++) {
                takenRegions[index] = project.regions[j];
                ownerProjects[index] = project.name;
                index++;
            }
        }
    }

    function registerProject(
        string memory _name,
        string memory _projectType,
        string memory _imageCID,
        string memory _dataCID,
        string[] memory _regions,
        uint256 _price
    ) external payable {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_imageCID).length > 0, "Image CID cannot be empty");
        require(bytes(_dataCID).length > 0, "Data CID cannot be empty");
        require(projects[_name].owner == address(0), "Project already exists");
        require(_regions.length > 0, "At least one region must be selected");
        require(msg.value >= _price, "Insufficient payment");

        // Check if regions are available
        for (uint i = 0; i < _regions.length; i++) {
            require(regions[_regions[i]].isTaken == false, "Region already taken");
        }

        // Mark regions as taken
        for (uint i = 0; i < _regions.length; i++) {
            regions[_regions[i]].isTaken = true;
            regions[_regions[i]].projectName = _name;
            emit RegionUpdated(_regions[i], true, _name);
        }

        // Create project
        projects[_name] = Project({
            name: _name,
            projectType: _projectType,
            imageCID: _imageCID,
            dataCID: _dataCID,
            owner: msg.sender,
            timestamp: block.timestamp,
            price: _price,
            regions: _regions
        });

        projectNames.push(_name);

        emit ProjectRegistered(
            _name,
            _projectType,
            _imageCID,
            _dataCID,
            msg.sender,
            block.timestamp,
            _price,
            _regions
        );

        // Refund excess ETH if any
        if (msg.value > _price) {
            payable(msg.sender).transfer(msg.value - _price);
        }
    }

    function getProject(string memory _name) external view returns (Project memory) {
        require(projects[_name].owner != address(0), "Project does not exist");
        return projects[_name];
    }

    function getAllProjects() external view returns (string[] memory) {
        return projectNames;
    }

    function getProjectCount() external view returns (uint256) {
        return projectNames.length;
    }

    // Function to withdraw collected ETH (only owner)
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
} 