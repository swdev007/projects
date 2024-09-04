import Image from 'next/image';
import Arrow from '../../assets/images/arrow.svg';
import BannerImage from '../../assets/images/banner.png';
import style from './Banner.module.scss';
import BannerForm from './BannerForm/BannerForm';

const Banner = () => {
  return (
    <section className={style.banner}>
      <Image className={style.banner__image} src={BannerImage} alt='Banner' />

      <div className='container'>
        <article className={style.banner__content}>
          <h1>A Refreshing New Way to Buy Your Next New Vehicle</h1>
          <div className={`${style.banner__info} flex`}>
            <span>Start here</span>
            <Image src={Arrow} alt='Arrow' />
          </div>
          <p>
            Shopping for a vehicle? Already know what you are looking for? Let
            us help you get the best deal on your next vehicle purchase! Tell us
            what you are looking for or paste the link to the site where you
            have found a vehicle like you want and we will do the rest!
          </p>
          <BannerForm />
        </article>
      </div>
    </section>
  );
};
export default Banner;
