import { BidStatusEnum, RequestAction } from '../enum/bids.enum';
import { BUTTON_STATUS, COLLUM_TYPE } from '../enum/table.enum';

export const buyerTableHeaderData = [
  {
    title: 'Dealer Name',
  },
  {
    title: 'Location',
  },
  {
    title: 'Offer Price',
  },
  {
    title: 'Vehicle Details',
  },
  {
    title: 'Message',
    actionType: RequestAction.MESSAGE,
  },
  {
    title: 'Action/Status',
    actionType: RequestAction.ACCEPT_REQUEST,
  },
];

export const buyerTableRowDataHandler = (data: any) => {
  return data?.map((el: any) => {
    if (el.link) {
      el.textType = 'link';
      el.text = el?.link;
    } else {
      el.text = `${el?.make}, ${el?.model}, ${el?.color}${
        el?.year ? ', ' + el?.year : ''
      }`;
    }

    return [
      {
        id: el?.bids[0]?.id,
        data: el,
        type: COLLUM_TYPE.TEXT,
        text: el?.bids[0]?.dealer,
        image: el?.bids[0]?.image,
      },
      {
        id: el?.bids[0]?.id,
        data: el,
        type: COLLUM_TYPE.TEXT,
        text: el?.bids[0]?.country,
      },
      {
        id: el?.bids[0]?.id,
        data: el,

        type: COLLUM_TYPE.TEXT,
        text: el?.bids[0]?.price
          ? `$${el?.bids[0]?.price}`
          : el?.bids[0]?.price,
      },
      {
        id: el?.bids[0]?.id,
        data: el,

        type: el?.textType === 'link' ? COLLUM_TYPE.LINK : COLLUM_TYPE.TEXT,
        text: el?.text ?? '',
      },
      {
        id: el?.bids[0]?.id,
        data: el,

        type: COLLUM_TYPE.ICON_WITH_COUNT,
        image: require('../../../assets/images/chat.svg'),
        clickable: true,
      },
      {
        id: el?.bids[0]?.id,
        requestId: el?.id,
        data: el,
        type: COLLUM_TYPE.BUTTON,
        clickable: true,
        label: el?.bids?.[0]?.status
          ? el?.bids[0]?.status == BidStatusEnum.ACCEPTED
            ? 'Accepted'
            : 'Accept'
          : 'No Offer',
        status: el?.bids?.[0]?.status
          ? el?.bids[0]?.status == BidStatusEnum.ACCEPTED
            ? BUTTON_STATUS.RESOLVED
            : BUTTON_STATUS.DEFAULT
          : BUTTON_STATUS.PENDING,
        disable:
          el?.bids.length == 0 ||
          el?.bids[0]?.status === BidStatusEnum.ACCEPTED,
      },
    ];
  });
};

export const checkIfTrueInArray = (
  arr: any[],
  key: string,
  value: boolean | string
) => {
  let status = arr?.findIndex((el: any) => el[key] == value);
  if (status == -1) {
    return false;
  } else {
    return true;
  }
};

let transformedData = (data: any) => {
  return data.flatMap((item: any) =>
    item.data.map((innerItem: any) => ({
      id: item.id,
      data: innerItem,
    }))
  );
};
