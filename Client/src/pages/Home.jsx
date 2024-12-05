import { Box, Grid2, Typography } from '@mui/material'
import React from 'react'
import NavBar from '../components/NavBar'


function Home() {
  return (
    <Box sx={{width:'100vw',height:'100vh'}}>
        <NavBar></NavBar>
        <Grid2 container spacing={2}>
            <Grid2 size={8}>
                <Box sx={{backgroundColor:'black', color:'white'}}>
                    
                </Box>
            </Grid2>
            <Grid2 size={4}>
                <Typography>madhachod</Typography>
            </Grid2>
        </Grid2>
    </Box>
  )
}

export default Home