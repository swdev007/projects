import { BUTTON_STATUS, COLLUM_TYPE } from '@/app/_lib/enum/table.enum';
import icon from '../../assets/images/chat.svg';
import samplePic from '../../assets/images/slide3.png';
import React from 'react';
import Image from 'next/image';
import style from './Table.module.scss';
import Link from 'next/link';
export function TableHeader({ data }: { data: any }) {
  return (
    <tbody>
      <tr>
        {data?.map((el: any, index: number) => {
          return <th key={index}>{el?.title}</th>;
        })}
      </tr>
    </tbody>
  );
}

export function TableRowUnit({
  data,
  columnData,
}: {
  data: any;
  columnData: any;
}) {
  switch (data.type) {
    case COLLUM_TYPE.ICON: {
      return <div></div>;
    }
    case COLLUM_TYPE.BUTTON: {
      let btnClass: string;
      if (data.status == BUTTON_STATUS.PENDING) {
        btnClass = `outline-warn pill ${data?.disable ? 'pointer-none' : ''}`;
      } else if (data.status == BUTTON_STATUS.RESOLVED) {
        btnClass = `outline-success pill ${
          data?.disable ? 'pointer-none' : ''
        }`;
      } else {
        btnClass = `outline-gray ${data?.disable ? 'pointer-none' : ''}`;
      }

      return (
        <button
          className={`button ${btnClass} md`}
          onClick={() => {
            columnData?.action(data?.id);
          }}
        >
          {data?.label}
        </button>
      );
    }
    case COLLUM_TYPE.ICON_ARRAY: {
      return <div></div>;
    }
    case COLLUM_TYPE.ICON_WITH_COUNT: {
      return (
        <button
          className={style.table__chat}
          onClick={() => {
            columnData?.action(data?.data);
          }}
        >
          <Image src={icon} alt='chat' />
          {data?.message?.length && (
            <span className='flex align-center justify-center'>2</span>
          )}
        </button>
      );
    }
    case COLLUM_TYPE.TEXT_WITH_IMAGE: {
      return (
        <div
          className={style.table__carInfo}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {data?.text && (
            <Image src={samplePic} alt='profile' width={40} height={40} />
          )}
          <p style={{ marginLeft: data?.text ? 4 : 0 }}>{data?.text ?? '-'}</p>
        </div>
      );
    }
    case COLLUM_TYPE.LINK: {
      return (
        <Link
          className={style.table__link}
          href={data?.text}
          rel='noopener noreferrer'
          target='_blank'
        >
          {data?.text}
        </Link>
      );
    }
    case COLLUM_TYPE.BUTTON_AND_ICON: {
      return <div></div>;
    }
    default: {
      return <p>{data.text ?? '-'}</p>;
    }
  }
}

export default function Table({
  emptyMessage,
  tableHeadings,
  tableRowData,
}: {
  emptyMessage: string;
  tableHeadings: { title: string; action?: any }[];
  tableRowData: any;
}) {
  return (
    <div className={style.table}>
      {tableRowData?.length == 0 ? (
        <span className={style.table__nodata}>{emptyMessage}</span>
      ) : (
        <table>
          <TableHeader data={tableHeadings} />
          <tbody>
            {tableRowData?.map((el: any, index: number) => {
              return (
                <tr key={index}>
                  {el?.map((item: any, index: number) => {
                    return (
                      <td key={index}>
                        <TableRowUnit
                          key={item?.id}
                          data={item}
                          columnData={tableHeadings[index]}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
