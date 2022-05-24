import { FileSet, FileSetDescriptor } from "./FileSet"
import fs = require('fs')

export type DuplicateFinderConfig = {
    existing: FileSetDescriptor
    incoming: FileSetDescriptor
    pattern: string 
}

function findDuplicates(config: DuplicateFinderConfig) {
    const existingFs = new FileSet(config.existing)
    const incomingFs = new FileSet(config.incoming)
    const twoSetDuplicates = existingFs.getTwoSetDuplicates(incomingFs) 
    twoSetDuplicates.forEach((duplicate, _hash) => {
        duplicate.incomingFiles.forEach(incomingFile => {
            let replaced = incomingFile.replaceVariables(config.pattern)
            replaced = incomingFs.replaceVariables(replaced)
            console.log(`${replaced}`)
        })
    })    
}

const configJson = fs.readFileSync('moveDuplicates.config.json', 'utf8')
const config = JSON.parse(configJson)


findDuplicates(config)

