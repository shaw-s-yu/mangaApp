import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import path from 'path'
const prisma = new PrismaClient()

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const buildMangaCollection = async (id: string, rootDirectory: string) => {
    const chapterFolders = await fs.readdirSync(rootDirectory);
    let loadedPages = 0
    for (let i = 0; i < chapterFolders.length; i++) {
        const chapterDirName = chapterFolders[i]
        const chapterDir = path.join(rootDirectory, chapterDirName)
        if (!fs.lstatSync(chapterDir).isDirectory()) {
            continue
        }
        const chapterName = extractChapter(chapterDirName)
        const { id: chapterID } = await prisma.chapters.create({
            data: {
                name: chapterName,
                mangaId: id
            }
        })
        const pageFiles = await fs.readdirSync(chapterDir);
        for (let j = 0; j < pageFiles.length; j++) {
            const pageDirName = pageFiles[j]
            const pageDir = path.join(chapterDir, pageDirName)
            if (!fs.lstatSync(pageDir).isFile()) {
                continue
            }
            console.log(loadedPages, pageDirName, chapterID, pageDir)
            try {
                const pageNumber = extractPage(pageDirName)

                const { id: pageID } = await prisma.pages.create({
                    data: {
                        index: pageNumber,
                        chapterId: chapterID,
                        path: pageDir
                    }
                })
                loadedPages += 1
            } catch (e) {
                continue
            }

            // console.log(loadedPages, pageID, pageDir)
        }
    }
    console.log('done')
}

export const extractFileInfo = (fileName) => {
    const levels = fileName.split('/')
    if (levels.length !== 3) {
        return [null, null]
    }
    // eslint-disable-next-line
    const [_root, chapter, episode] = levels
    return [extractChapter(chapter), extractPage(episode)]
}

export const extractChapter = (path) => {
    return path.match(/\d+/)[0]
}

export const extractPage = (fileName: string): number => {
    return parseFloat(fileName.split('.')[0].match(/[\d\.]+/g).pop())
}