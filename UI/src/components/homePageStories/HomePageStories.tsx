import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
// Import Styles
import Styles from './home_page_stories_style.module.css';
function HomePageStories() {
  return (
    <Container className={Styles.container}>
      <Typography variant="h4" className="textHeading">
        Grocery delivery you can count on
      </Typography>
      <Container className={Styles.boxContainer}>
        <Box className={Styles.subContainer}>
          <Typography variant="h4" className="textHeading">
            Choose what you want
          </Typography>
          <Typography variant="caption">
            Select items from your favorite grocery stores at Instacart.com or
            in the app.
          </Typography>

          <img
            width={300}
            src="https://www.instacart.com/image-server/347x214/filters:fill(FFF,true):format(webp)/www.instacart.com/assets/homepage/choose-what-you-want-efca561a8f08c2a5ce5ed77df6c10bf54d4439ca8434f12e9d9641bf91dd2b43.jpg"
            alt="family looking at mobile"
          ></img>
        </Box>

        <Box className={Styles.subContainer}>
          <Typography variant="h4" className="textHeading">
            See real-time updates
          </Typography>
          <Typography variant="caption">
            Personal shoppers pick with care. Chat as they shop and manage your
            order.
          </Typography>

          <img
            width={300}
            src="https://www.instacart.com/image-server/347x214/filters:fill(FFF,true):format(webp)/www.instacart.com/assets/homepage/see-real-time-updates-1d23ec0f423b24300c0cd6abcb4724f36b0af840fbdf106aa5f140e835cff7eb.jpg"
            alt="family looking at mobile"
          ></img>
        </Box>
        <Box className={Styles.subContainer}>
          <Typography variant="h4" className="textHeading">
            Get your items same-day
          </Typography>
          <Typography variant="caption">
            Pick a convenient time for you. Enjoy Instacart’s 100% quality on
            every order.
          </Typography>

          <img
            width={300}
            src="https://www.instacart.com/image-server/347x214/filters:fill(FFF,true):format(webp)/www.instacart.com/assets/homepage/get-your-items-same-day-c85bb8474d3f09fe7eec97688767459f93852e29bf3fa849ab410f73d6f91b3a.jpg"
            alt="family looking at mobile"
          ></img>
        </Box>
      </Container>
      <Container className={Styles.btnContainer}>
        <Button>Explore More</Button>
      </Container>
    </Container>
  );
}

export default HomePageStories;
