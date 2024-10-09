import { FC } from "react";

interface ErrorMsgProps {
  error: [obj: { msg: string }] | undefined;
}

const ErrorMsg: FC<ErrorMsgProps> = ({ error }) => {
  const errors = [];

  if (error) {
    for (let i = 0; i < error.length; i++) {
      errors.push(error[i].msg);
    }
  }
  return <p className='text-red-600'>{errors}</p>;
};

export default ErrorMsg;
