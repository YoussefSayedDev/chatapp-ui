import moment from "moment";
import { FC } from "react";

interface MomentProps {
  timestamp: string | Date;
}

const formatDate = (date: string | Date) => {
  // Current date & time
  const now = moment();

  // Message date & time
  const messageDate = moment(date);

  // If it's the same day, show time
  if (now.isSame(messageDate, "day")) return messageDate.format("h:mm A");
  // If it's yesterday, show "Yesterday"
  else if (now.subtract(1, "days").isSame(messageDate, "day"))
    return "Yesterday";
  // If it's within the same week, show day of the week
  else if (now.isSame(messageDate, "week")) return messageDate.format("dddd");
  // Otherwise, show the date in DD/MM/YYYY format
  else return messageDate.format("DD/MM/YYYY");
};

const Moment: FC<MomentProps> = ({ timestamp }) => {
  return <span className='text-sm ms-3 self-end'>{formatDate(timestamp)}</span>;
};

export default Moment;
