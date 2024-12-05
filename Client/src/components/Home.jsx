import React from 'react'
import {Box, Button, TextField} from '@mui/material'

function Home() {
    const submitHandler = (e) => {
        e.preventDefault();

        

    }
  return (
    <Box>
        <form onSubmit={submitHandler}>
            <TextField placeholder='Write a message' variant="outlined" />
            <Button type='submit'>Send</Button>
        </form>
    </Box>
  )
}

export default Home