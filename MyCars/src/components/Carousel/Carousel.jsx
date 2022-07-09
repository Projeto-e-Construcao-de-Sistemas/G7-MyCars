import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

import './Carousel.css';

export function Carousel({ images = [], title }) {

  const [imageObject, setImageObject] = useState([]);


  useEffect(() => {

    function createImageObject() {
      if (imageObject.length !== 0) return;
      const imageObj = [];
      let key = 0;
      images.forEach((img) => {
        imageObj.push({ img, key });
        key++;
      });

      setImageObject(imageObj);
    }

    createImageObject();
  }, [setImageObject, images, imageObject])

  return (
    <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {imageObject?.map((img) => {
          return (<button key={img.key} type="button" data-bs-target="#myCarousel" className={img.key === 0 ? "active" : ""} aria-current={img.key === 0 ? "true" : "false"} data-bs-slide-to={img.key} aria-label={title}></button>)

        })}
      </div>

      <div className="carousel-inner">
        {imageObject?.map((img) => {
          return (
            <div className={`carousel-item ${(img.key === 0) ? "active" : ""}`} key={img.key}>
              <img src={img.img} alt={title} />
              <div className="container">
              </div>
            </div>
          )
        })}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}
