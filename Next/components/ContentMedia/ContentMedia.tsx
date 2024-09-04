import Image from 'next/image';
import style from './ContentMedia.module.scss';
import Button from '../Button/Button';

const ContentMedia = ({
  title,
  description,
  image,
  imageRight = false,
}: {
  title: string;
  description: any;
  image: any;
  imageRight?: boolean;
}) => {
  return (
    <div
      className={`${style.contentMedia} flex-wrap ${
        imageRight && style.isReverse
      }`}
    >
      {image && (
        <picture>
          <Image src={image} alt='media' />
        </picture>
      )}
      <article>
        {title && <h4>{title}</h4>}
        {description}
      </article>
    </div>
  );
};
export default ContentMedia;
