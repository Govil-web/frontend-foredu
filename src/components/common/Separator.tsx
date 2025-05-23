// src/components/Separator.tsx
import { Box } from '@mui/material';

const Separator = () => (
    <Box
        sx={theme => ({
            width: '1.5px',
            height: 34,
            backgroundColor: theme.palette.grey[400],
        })}
    />
);

export default Separator;