// Importing the react
import React from 'react';

// Importing the mui component
import { Box, Container, Typography } from '@mui/material';

// Importing images
import BannerImg from '../../assets/homePageBanner.png';

// Importing css files
import Styles from './container_style.module.css';

const DashboardBanner: React.FC = () => {
  return (
    <Container
      className={Styles.bannerStyle}
      maxWidth={false}
      sx={{
        backgroundImage: `url(${BannerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box className={Styles.textContainer}>
        <Typography variant="h3" className="textHeading">
          Order groceries for <br />
          delivery or pickup today
        </Typography>
        <Typography variant="body2" className={Styles.textPara}>
          Whatever you want from local stores, brought right to your door.
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardBanner;
