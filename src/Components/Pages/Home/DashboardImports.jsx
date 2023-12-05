import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import Footer from "../Footer/Footer";
import pData from "../../../Components/utilities/topPicksData";
import { summerData } from "../../utilities/summerPicks";
import { electronicData } from "../../utilities/electronicsPicks";
import { winterData } from "../../utilities/winterWear";
import image1 from "../../../Images/Dashboard1.jpg";
import image2 from "../../../Images/Dashboard2.jpg";
import image3 from "../../../Images/Dashboard3.jpg";
import image4 from "../../../Images/Dashboard4.jpg";
import image5 from "../../../Images/Dashboard5.jpg";
import image6 from '../../../Images/Dashboard6.jpg';
import image7 from '../../../Images/Dashboard7.jpg';
import ImageComponent from "../../utilities/ImageComponent";
import { Carousel } from 'react-responsive-carousel';
import { sContext } from "../../ContextApi/SearchBarContext";

export { React, useState, useEffect, useContext, useNavigate, AwesomeSlider, withAutoplay, Footer, pData, image1, image2, image3, image4, image5, image6, image7, ImageComponent, Carousel, sContext, summerData, winterData,electronicData };