import React from 'react';

export default function ConfirmationModal({
  title,
  accept,
  reject,
  loading = false,
}: {
  title: string;
  accept: any;
  reject: any;
  loading: boolean;
}) {
  return (
    <div>
      <h3 className='flex justify-center'>{title}</h3>
      <br />
      <br />
      <div className='flex justify-center'>
        <button className='button outline-gray' onClick={reject}>
          Cancel
        </button>
        <button className='button' onClick={accept} disabled={loading}>
          Yes
        </button>
      </div>
    </div>
  );
}
