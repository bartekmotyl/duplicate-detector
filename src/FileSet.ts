import path = require('path')
import fs = require('fs')

export type InnerDuplicate = {
    hash: string
    files: FileInfo[]
}

export type FileSetDescriptor = {
    filePath: string
    basePath: string
}
export type TwoSetDuplicate = {
    hash: string
    existingFiles: FileInfo[]
    incomingFiles: FileInfo[]
}

export class FileInfo {
    public fileName: string
    public folderPath: string
    public localFilePath: string
    public size: number
    public hash: string  
    
    constructor(localFilePath: string, size: number, hash: string) {
        this.localFilePath = localFilePath
        this.folderPath = path.dirname(localFilePath)
        this.fileName = path.basename(localFilePath)
        this.size = size
        this.hash = hash
    }

    replaceVariables(text: string) {
        return text
            .replaceAll('{fileName}', this.fileName)
            .replaceAll('{folderPath}', this.folderPath)
            .replaceAll('{localFilePath}', this.localFilePath)
            .replaceAll('{hash}', this.hash)
            .replaceAll('{size}', `${this.size}`)
    }    
}

export class FileSet {
    files: FileInfo[] = []
    filesByHash: Map<string, FileInfo[]> = new Map<string, FileInfo[]>()
    basePath: string

    constructor(descriptor: FileSetDescriptor) {
        this.basePath = descriptor.basePath
        const textContent = fs.readFileSync(descriptor.filePath, 'utf8')
        const lines = textContent.split('\n')
        lines.forEach(line => {
            const fileInfo = this.parseLine(line, descriptor.basePath)
            if (fileInfo) {
                this.files.push(fileInfo)
                if (!this.filesByHash.has(fileInfo.hash)) {
                    this.filesByHash.set(fileInfo.hash, [])
                }
                this.filesByHash.get(fileInfo.hash).push(fileInfo)
            }
        })
    }

    parseLine(line: string, basePath: string): FileInfo | undefined {
        if (!line || line.trim()==='' || line.startsWith('%') || line.startsWith('#')) {
            return undefined
        }
        const parts = line.split(',')
        const size = parseInt(parts[0])
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _hashMd5 = parts[1]
        const hashSha256 = parts[2]
        const filePath = parts[3]

        if (!filePath.startsWith(basePath)) {
            throw new Error(`Path ${filePath} does not start with ${basePath}`)
        }
        const localFilePath = filePath.replace(basePath, '')
        return new FileInfo(localFilePath, size, hashSha256)
    }

    replaceVariables(text: string) {
        return text
            .replaceAll('{basePath}', this.basePath)
    }      

    getDuplicates(): InnerDuplicate[] {
        const duplicates: InnerDuplicate[] = []
        this.filesByHash.forEach((files, hash) => {
            if (files.length > 1) {
                duplicates.push({
                    hash: hash,
                    files: files,
                })
            }
        })
        return duplicates
    }

    /**
     * Returns duplicates (files with same hash) between two file sets - current (aka existing) 
     * and other (aka incoming)
     * 
     * @param incoming 
     * @returns 
     */
    getTwoSetDuplicates(incoming: FileSet): TwoSetDuplicate[] {
        const duplicates: TwoSetDuplicate[] = []
        this.filesByHash.forEach((files, hash) => {
            if (incoming.filesByHash.has(hash)) {
                duplicates.push({
                    hash: hash,
                    existingFiles: files,
                    incomingFiles: incoming.filesByHash.get(hash),
                })
            }
        })
        return duplicates        
    }


} 