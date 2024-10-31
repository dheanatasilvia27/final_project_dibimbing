import React, {useEffect} from 'react'
import { useState } from 'react'
import './main.css'
import axios from 'axios'
import img from '../../Assets/newzealand.jpg'
import {HiOutlineLocationMarker} from 'react-icons/hi'
import {HiOutlineClipboardCheck} from 'react-icons/hi'

import Aos from "aos";
import 'aos/dist/aos.css'


const Main = () => {

const [banners, setBanners] = useState([])
const [promos, setPromos] = useState([])


//Banners
const getBanners = () => {
  axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners", {
    headers: {
      'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',  // Coba gunakan x-api-key jika Bearer tidak diterima
    }
  })
  .then((res) => {
    
    setBanners(res.data.data);
  })
  .catch((err) => {
    console.log(err.response);
  })
};

useEffect(() => {
  getBanners();
}, [])

//promo
const getPromos = () => {
  axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos", {
    headers: {
      'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',  // Coba gunakan x-api-key jika Bearer tidak diterima
    }
  })
  .then((res) => {
    
    setPromos(res.data.data);
  })
  .catch((err) => {
    console.log(err.response);
  })
};

useEffect(() => {
  getPromos();
}, [])

  useEffect(() => {
    Aos.init({duration: 2000})
}, [])

console.log('promos', promos)

  return (
    <section className='main container section'>
      <div className="secTitle">
        <h3 data-aos="fade-right" className="title">
          Most visited destinations
        </h3>
      </div>
    <div className="secContent grid" >

      {
        banners.map((banners)=> {
          return(
            <div  key={banners.id} data-aos="fade-up" className='singleDestination'>
              <div className="imageDiv" data-aos="fade-up" >
              <img  src={banners.imageUrl} alt={banners.name} />
              </div>
              <div className="cardInfo">
              <h4 className="destTitle">{banners.name}</h4>
              <h4 className="destTitle">{banners.title}</h4>
              </div>
              
            </div>
          )
        })
      }


    </div>
      
    </section>
  )
}

export default Main