'use client';
import Link from 'next/link';
import style from './NotFoundPage.module.scss';

export default function NotFound() {
  return (
    <div className={style.NotFoundPage}>
      <div className={`${style.NotFoundPage__inner} flex-wrap align-center`}>
        <article>
          <strong>404</strong>
          <h1>Page Not Found</h1>
          <p>
            The page you are looking for might be in another universe. Please
            check the URL or click the button below to go back.
          </p>
          <Link className='button' href='/'>
            Home
          </Link>
        </article>
      </div>
    </div>
  );
}
