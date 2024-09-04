'use client';

import BgImage from '@/assets/images/choose-vehicle-bg.png';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import style from './ChooseVehicle.module.scss';
import slide1 from '@/assets/images/slide1.png';
import slide2 from '@/assets/images/slide2.png';
import slide3 from '@/assets/images/slide3.png';
import slide4 from '@/assets/images/slide4.png';

const ChooseVehicle = () => {
  const settings = {
    dots: true,
    speed: 500,
    arrows: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className={style.chooseVehicle}>
      <Image className={style.chooseVehicle__bg} src={BgImage} alt='Bg' />

      <div className={`${style.chooseVehicle__content} container`}>
        <article className={style.chooseVehicle__intro}>
          <h2>Where will your next vehicle come from?</h2>
          <p>
            Get excited about purchasing your next vehicle using our new car
            buying platform!
          </p>
        </article>

        <div className={style.chooseVehicle__slider}>
          <Slider {...settings}>
            <div>
              <Image src={slide1} alt='' />
            </div>
            <div>
              <Image src={slide2} alt='' />
            </div>
            <div>
              <Image src={slide3} alt='' />
            </div>
            <div>
              <Image src={slide4} alt='' />
            </div>
            <div>
              <Image src={slide1} alt='' />
            </div>
            <div>
              <Image src={slide2} alt='' />
            </div>
            <div>
              <Image src={slide3} alt='' />
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};
export default ChooseVehicle;
