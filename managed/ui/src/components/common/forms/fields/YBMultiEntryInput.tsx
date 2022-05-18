/*
 * Created on Thu Apr 22 2022
 *
 * Copyright 2021 YugaByte, Inc. and Contributors
 * Licensed under the Polyform Free Trial License 1.0.0 (the "License")
 * You may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://github.com/YugaByte/yugabyte-db/blob/master/licenses/POLYFORM-FREE-TRIAL-LICENSE-1.0.0.txt
 */

import React, { FC, useRef, useState } from 'react';
import { find, isFunction } from 'lodash';

import CreatableSelect from 'react-select/creatable';
import { Props, SelectComponentsConfig, Styles } from 'react-select';

interface Option {
  readonly label: string;
  readonly value: string;
}

const DEFAULT_MULTI_ENTRY_INPUT_STYLE: Partial<Styles> = {
  control: (base) => ({ ...base, borderRadius: '8px', minHeight: '42px' })
};

interface YBMultiEntryInputProps {
  defaultOptions?: Option[];
  delimiters?: string[];
  onChange?: (val: Option[]) => void;
  placeholder?: string;
  //Controlled Component
  val: Option[];
  components?: Partial<SelectComponentsConfig<Option>> | undefined;
  styles?: Partial<Styles>;
  isLoading?: boolean;
  isDisabled?: boolean;
  additionalProps?: Props;
}

export const YBMultiEntryInput: FC<YBMultiEntryInputProps> = ({
  defaultOptions = [],
  val = [],
  delimiters = [],
  placeholder = '',
  isLoading = false,
  onChange,
  components,
  styles,
  isDisabled,
  additionalProps
}) => {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<Option[]>(val);

  const selectRef = useRef<any>(null);

  const delim = [...delimiters, 'Enter', 'Tab'];

  const handleChange = (value: any) => {
    const newValue = value ?? [];
    setValue(newValue);
    isFunction(onChange) && onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!inputValue || inputValue.trim().length === 0) return;

    //if the user enters the delim key
    if (delim.includes(e.key)) {
      e.preventDefault();
      setInputValue(''); //clear the input text

      // don't allow duplicates
      if (find(value, { value: inputValue })) {
        return;
      }

      setValue([...value, { label: inputValue, value: inputValue }]);

      isFunction(onChange) && onChange([...value, { label: inputValue, value: inputValue }]);

      isFunction(selectRef.current.focus) && selectRef.current.focus(); //keep the focus
    }
  };

  return (
    <CreatableSelect
      ref={selectRef}
      components={components}
      styles={{
        ...DEFAULT_MULTI_ENTRY_INPUT_STYLE,
        ...styles
      }}
      isLoading={isLoading}
      inputValue={inputValue}
      onChange={handleChange}
      onInputChange={setInputValue}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      value={value}
      options={defaultOptions}
      formatCreateLabel={(val) => {
        if (!val.trim()) return null;
        return `Create "${val}" option`;
      }}
      isDisabled={isDisabled}
      isClearable
      isMulti
      {...additionalProps}
    />
  );
};