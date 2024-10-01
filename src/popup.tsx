import "~style.css";

import { useStorage } from "@plasmohq/storage/hook";

import CountryPicker from "~components/CountryPicker";

function IndexPopup() {
  const [isExtEnable, setIsExtEnable, { setRenderValue, setStoreValue }] =
    useStorage("isExtEnable");

  const [
    isShowSecondCaptions,
    setIsShowSecondCaptions,
    {
      setRenderValue: setRenderValueSecondCaptions,
      setStoreValue: setStoreValueSecondCaptions,
    },
  ] = useStorage("isShowSecondCaptions");

  return (
    <div className="flex-col items-center px-2 py-4 justify-center w-96">
      <div className="border-b-2 border-b-gray-600 border-solid">
        <h3 className="text-3xl italic font-semibold font-mono">
          Dual Captions
        </h3>
      </div>
      <div className="flex flex-col">
        <div className="form-control w-100">
          <label className="label cursor-pointer">
            <span className="label-text">Show dual-captions panel</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isExtEnable}
              onChange={(e) => {
                setIsExtEnable(e.target.checked);
                setRenderValue(e.target.checked);
                setStoreValue(e.target.checked);
              }}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Show second captions</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isShowSecondCaptions}
              onChange={(e) => {
                setIsShowSecondCaptions(e.target.checked);
                setRenderValueSecondCaptions(e.target.checked);
                setStoreValueSecondCaptions(e.target.checked);
              }}
            />
          </label>
          <CountryPicker />
        </div>
      </div>
    </div>
  );
}

export default IndexPopup;
