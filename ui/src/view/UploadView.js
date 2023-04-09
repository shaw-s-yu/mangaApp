import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// import { validate_path, get_chapter_name } from '../../utils/utils'
// import axios from 'axios'
// import urls from '../../utils/urls'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    width: '60%',
    height: 300,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 64,
  },
  input: {
    marginTop: 24,
    width: '80%',
  },
})

export default function UploadView({ setScreen }) {
  const classes = useStyles()

  const [mangaName, setMangaName] = useState('')
  const [mangaDescription, setMangaDescription] = useState('')
  const [files, setFiles] = useState([])
  const [previewImage, setPreviewImage] = useState(null)

  return (
    <React.Fragment>
      <div className={classes.root}>
        Upload By Whole Manga
        <div className={classes.container}>
          <Button onClick={() => setScreen(0)} variant="contained">
            Go Back
          </Button>

          <TextField
            className={classes.input}
            label="Manga Name"
            variant="outlined"
            value={mangaName}
            onChange={(e) => setMangaName(e.target.value)}
          />
          <TextField
            className={classes.input}
            label="Manga Description"
            variant="outlined"
            value={mangaDescription}
            onChange={(e) => setMangaDescription(e.target.value)}
          />

          <div className={classes.input}>pick a preview Image</div>
          <div className={classes.input}>
            <input
              type="file"
              onChange={(e) => {
                setPreviewImage(e.target.files[0])
              }}
            />
          </div>

          <div className={classes.input}>pick a directory</div>
          <div className={classes.input}>
            <input
              type="file"
              webkitdirectory="true"
              multiple
              onChange={(e) => {
                console.log(e.target.files)
                // let uploaded_files = validate_path([...e.target.files])
                // uploaded_files.sort((a, b) => {
                //   const f1 = Number(a.name.split('.')[0])
                //   const f2 = Number(b.name.split('.')[0])
                //   return f1 !== f2 ? (f1 < f2 ? -1 : 1) : 0
                // })
                // setFiles(uploaded_files)
              }}
            />
          </div>

          <div className={classes.input}>
            <Button
              disabled={!files.length > 0}
              onClick={() => {
                if (mangaName === '' || mangaDescription === '' || !previewImage) {
                  alert('manga name/description cannot be empty')
                  return
                }

                const formData = new FormData()

                formData.append('mangaName', mangaName)
                formData.append('mangaDesc', mangaDescription)
                formData.append('previewImage', previewImage)

                const filenames = files.map((_, i) => 'file' + i)
                formData.append('filenames', filenames)

                // let chapterList = {}

                // for (let i = 0; i < files.length; i++) {
                //   const chapter = get_chapter_name(files[i])
                //   formData.append(filenames[i], files[i])
                //   formData.append(filenames[i] + '_chapter', chapter)
                //   if (chapterList[chapter] === undefined) chapterList[chapter] = 1
                // }
                // chapterList = Object.keys(chapterList)
                // formData.append('chapterlist', chapterList)

                // axios.post(urls.upload_manga, formData).then((res) => {
                //   const { err, msg } = res.data
                //   if (err) alert(msg)
                //   else window.location.reload()
                // })
              }}
              variant="contained"
            >
              submit
            </Button>
          </div>
          <div className={classes.input}>
            file list:
            {files.map((e, i) => (
              <div key={i}>{e.webkitRelativePath}</div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
