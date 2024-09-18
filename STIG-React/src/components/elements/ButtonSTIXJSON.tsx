import React, { useEffect, useState } from 'react';
import ButtonBasic from './ButtonBasic';

type Props = {
  showJson: boolean;
  setIsShowingJson: React.Dispatch<React.SetStateAction<boolean>>;
  color?: 'btn-primary' | 'btn-secondary' | 'btn-neutral' | 'btn-ghost';
  size: 'standard' | 'small'
};

const ButtonSTIXJSON: React.FC<Props> = ({ showJson, setIsShowingJson, color, size }) => {
  function toggleJSONPropertyView() {
    setIsShowingJson(!showJson)
  }

  const [buttonSize, setbuttonSize] = useState<string>('');

  useEffect(() => {
    setbuttonSize((size === 'standard') ? 'btn-sm w-[95px]' : 'btn-xs w-[80px]');
  }, [size]);

  return (
    <ButtonBasic label={!showJson ? 'VIEW JSON' : 'VIEW FORM'} color={color ? color : 'btn-primary'} additionalClasses={`${buttonSize}`} onClick={toggleJSONPropertyView}></ButtonBasic>
  );
};

export default ButtonSTIXJSON;