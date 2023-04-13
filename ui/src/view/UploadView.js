import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { SERVER_URL } from '../utils/config'
import { fetchApi } from '../utils/apiHelper'

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
  const [path, setPath] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <React.Fragment>
      <div className={classes.root}>
        Format files into Manga Collection
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

          <TextField
            className={classes.input}
            label="File Path"
            variant="outlined"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />

          <div className={classes.input}>
            <LoadingButton
              disabled={mangaName == null || mangaDescription == null || previewImage == null || path == null}
              size="small"
              color="secondary"
              onClick={async () => {
                setLoading(true)
                const formdata = new FormData()
                formdata.append('previewImage', previewImage);
                formdata.append('mangaName', mangaName);
                formdata.append('mangaDescription', mangaDescription);
                formdata.append('path', path);
                const response = await fetchApi(`${SERVER_URL}/manga`, 'POST', formdata);
                setLoading(false)
                alert(JSON.stringify(response))
              }}
              loading={loading}
              loadingPosition="start"
              variant="contained"
            >
              <span>Save</span>
            </LoadingButton>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
