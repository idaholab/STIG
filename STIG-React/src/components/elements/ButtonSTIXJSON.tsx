import React from 'react';
import ButtonBasic from './ButtonBasic';

type Props = {
  showJson: boolean;
  setIsShowingJson: React.Dispatch<React.SetStateAction<boolean>>;
};

const ButtonSTIXJSON: React.FC<Props> = ({ showJson, setIsShowingJson }) => {
  function toggleJSONPropertyView() {
    setIsShowingJson(!showJson)
  }
  return (
    <ButtonBasic label={!showJson ? 'VIEW JSON' : 'VIEW FORM'} color='btn-primary' additionalClasses={'btn-sm w-[95px]'} onClick={toggleJSONPropertyView}></ButtonBasic>
  );
};

export default ButtonSTIXJSON;