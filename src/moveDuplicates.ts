import { FileSet, FileSetDescriptor } from "./FileSet"
import fs = require('fs')

export type DuplicateFinderConfig = {
    existing: FileSetDescriptor
    incoming: FileSetDescriptor
    pattern: string 
}

function findDuplicates(config: DuplicateFinderConfig): string[] {
    const existingFs = new FileSet(config.existing)
    const incomingFs = new FileSet(config.incoming)
    const twoSetDuplicates = existingFs.getTwoSetDuplicates(incomingFs) 
    const lines: string[] = []
    twoSetDuplicates.forEach((duplicate, _hash) => {
        duplicate.incomingFiles.forEach(incomingFile => {
            let replaced = incomingFile.replaceVariables(config.pattern)
            replaced = incomingFs.replaceVariables(replaced)
            lines.push(`${replaced}`)
        })
    })    
    lines.sort()
    return lines
    
}

const configJson = fs.readFileSync('moveDuplicates.config.json', 'utf8')
const config = JSON.parse(configJson)


const lines = findDuplicates(config)
lines.forEach(line => console.log(line))

