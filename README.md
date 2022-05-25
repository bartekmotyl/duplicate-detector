# Problem statement

Most of us have many devices that can take photos or record videos (cameras, smartphones, drones, gopros etc.). 
It become pretty challenging if one wants to have all these media files archived in organised way. 

This tool is focused on solving one particular problems that arise along the way - how to detect and deal with duplicted files (i.e. files having the same content, not necessairly the same name).

The toolset works with hash files i.e. output of `hashdeep` in a folder. By analysing single (or multiple) hash files it is possible to effectively detect duplicates and do something with them. Particular tasks are realised by separate scripts. 


## modeDuplicates

Input: 
- list of hashes in folder 1 (aka *existing*)
- list of hashes in folder 2 (aka *incoming*)
- command pattern 

Input: 
- list of commands (based on pattern evaluated for a single file) for every file in *incoming* that has been detected as duplicate (already existing in *existing*)

For example, the command may be `rm` or `mv`  
