import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";



export default function UnderConstructionPage () {

    return (
        // <Grid container spacing={2}>
        //     <Grid item xs={6}>
        //     </Grid>
        //     <Grid item xs={6}>
        //         <Image  
        //          src={'/empty_states/under-construction.png'}
        //          alt="under-construction"
        //          width={645}
        //          height={564}
        //         />
        //     </Grid>
        // </Grid>
        <Box display={'flex'}  height={window.innerHeight-150}>
            <Box flexGrow={1} display={'flex'} flexDirection={'column'} alignItems={'flex-end'} justifyContent={'center'}>
                <Typography fontSize={62} variant="h2" textTransform={'uppercase'}>
                    Page is under
                </Typography>
                <Typography fontSize={60} variant="h1" textTransform={'uppercase'} fontWeight={'bold'}>
                    construction
                </Typography>
                <Typography  variant="h6" textTransform={'uppercase'} pt={10} pr={12}>
                    Thanks for your patience
                </Typography>
            </Box>
            <Box flexGrow={1} display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
                <Image  
                 src={'/empty_states/under-construction.png'}
                 alt="under-construction"
                 width={645}
                 height={564}
                />
            </Box>
        </Box>
    )
}