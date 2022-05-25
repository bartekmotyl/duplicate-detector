# Problem of duplicated media files

Most of us have many devices that can take photos or record videos (cameras, smartphones, drones, gopros etc.). 
It become pretty challenging if one wants to have all these media files archived in organised way. 

This tool is focused on solving one particular problems that arise along the way - how to detect and deal with duplicted files (i.e. files having the same content, not necessairly the same name).

The toolset works with hash files i.e. output of `hashdeep` in a folder. By analysing single (or multiple) hash files it is possible to effectively detect duplicates and do something with them. Particular tasks are realised by separate scripts. 

To generate list of hashed in a folder, one may use the following command: 
```
hashdeep -r -e /path/to/folder >hashes.txt
```

## moveDuplicates

### Use case 
You have some files already in the archive and some new files to be put to the archive. But before copying them you would like to make sure that you are copying duplicates. 
All duplicates should be at first removed from new files (before copying). 

### Input 
- list of hashes in folder 1 (aka *existing*)
- list of hashes in folder 2 (aka *incoming*)
- command pattern 

### Output: 
- list of commands (based on pattern evaluated for a single file) for every file in *incoming* that has been detected as duplicate (already existing in *existing*)

For example, the command may be `rm` or `mv`  

### Usage

At first make sure the project is compiled - `npm run build`. 
Then (in a temporary directory) preapre `moveDuplicates.config.json` file (sample can be found in `configs/moveDuplicates.config.example.json`.
Then run the following `node` command: 

```
node /path/to/duplicate-detector/js/moveDuplicates.js >commands.sh
```
