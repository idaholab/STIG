import React from 'react';
import "flatpickr/dist/flatpickr.min.css";
import Flatpickr from "react-flatpickr";
import flatpickr from "flatpickr";

type Props = {
  value?: string | number;
  onChange:  flatpickr.Options.Hook | undefined;
  className?: string;
};

const FormElementDatePicker: React.FC<Props> = ({
  value,
  onChange,
  className
}) => {
  return (
    <Flatpickr
      className={`input ${className}`}
      data-enable-time
      options={{
        time_24hr: true,
        allowInput: true,
        dateFormat: "Z"
      }}
      value={value}
      onChange={onChange}
    />
  );
}

export default FormElementDatePicker;
