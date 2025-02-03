import React, { useEffect, useState } from 'react';
import ButtonBasic from './ButtonBasic';

type Props = {
  showJson: boolean;
  setIsShowingJson: React.Dispatch<React.SetStateAction<boolean>>;
  type?: 'btn-primary' | 'btn-neutralc' | 'btn-ghost';
  size: 'standard' | 'small';
};

const ButtonSTIXJSON: React.FC<Props> = ({ showJson, setIsShowingJson, type, size }) => {
  function toggleJSONPropertyView() {
    setIsShowingJson(!showJson);
  }

  const [buttonSize, setbuttonSize] = useState<string>('');

  useEffect(() => {
    setbuttonSize(size === 'standard' ? 'btn-sm w-[95px]' : 'btn-xs w-[80px]');
  }, [size]);

  return (
    <ButtonBasic
      label={!showJson ? 'VIEW JSON' : 'VIEW FORM'}
      type={type ? type : 'btn-primary'}
      additionalClasses={`${buttonSize}`}
      onClick={toggleJSONPropertyView}
    />
  );
};

export default ButtonSTIXJSON;
