import React, { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import type { CountrySelectType } from "~types";

import countries from "../constants/languageOptions";

const CountryPicker = () => {
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [secondLanguage, setSecondLanguage, { setStoreValue }] =
    useStorage("secondLanguage");

  useEffect(() => {
    setSelectedCountry(secondLanguage);
  }, [secondLanguage]);

  const handleCountrySelect = (countryCode: string) => {
    setSecondLanguage(countryCode);
    setSelectedCountry(countryCode);
    setStoreValue(countryCode);
  };

  return (
    <label className="label cursor-pointer">
      <span className="label-text">Second language</span>
      <select
        value={selectedCountry}
        onChange={(e) => handleCountrySelect(e.target.value)}
        className="w-30 select select-bordered"
      >
        <option disabled selected>
          Select Country
        </option>
        {filteredCountries.map((country) => (
          <option
            key={country.code}
            value={country.code}
            className="p-2 hover:bg-base-300 cursor-pointer"
          >
            {country.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default CountryPicker;
