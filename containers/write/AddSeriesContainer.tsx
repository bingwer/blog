import { UseSeriesReturnType } from '@hooks/write/useSeries';
import { cls } from '@libs/util';
import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

interface AddSeriesContainerProps {
  setOpenSeriesMenu: React.Dispatch<React.SetStateAction<boolean>>;
  series: UseSeriesReturnType;
}

function AddSeriesContainer(props: AddSeriesContainerProps) {
  const {
    setOpenSeriesMenu,
    series: {
      selectedSeries,
      seriesList,
      actions: { setSelectedSeries, addSeries },
      formActions: { register, handleSubmit, setValue },
    },
  } = props;
  const [showSeriesURLInput, setShowSeriesURLInput] = useState(false);
  const [isCustomURL, setIsCustomURL] = useState(false);
  const copyNameToURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCustomURL) setValue('seriesURL', e.target.value);
  };

  return (
    <section className="flex h-96 w-96 flex-col justify-between px-6">
      <p className="mb-[0.56rem] text-xl">모음집 설정</p>
      <div className="flex h-full w-full flex-col">
        <OutsideClickHandler
          onOutsideClick={() => setShowSeriesURLInput(false)}
        >
          <form onSubmit={addSeries && handleSubmit(addSeries)}>
            <div className="h-fit w-full space-y-2 bg-slate-200 p-3">
              <input
                className="h-8 w-full px-3 focus:outline-none"
                placeholder="새로운 모음집 이름 입력"
                {...register('seriesName', { required: true })}
                onFocus={() => setShowSeriesURLInput(true)}
                onChange={copyNameToURL}
                required
              />
              {showSeriesURLInput && (
                <div className="relative">
                  <input
                    type="text"
                    className="h-8 w-full bg-white pb-1 pl-[4.2rem] pr-3 text-text-dark focus:outline-none dark:bg-black dark:text-text-white"
                    {...register('seriesURL')}
                    onKeyDown={() => setIsCustomURL(true)}
                    autoComplete="false"
                  />
                  <span className="absolute left-3 top-[0.15rem]">
                    /series/
                  </span>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="flex h-9 w-12 items-center justify-center space-x-4 rounded-md bg-transparent text-sm text-l-mainColor "
                  onClick={() => setShowSeriesURLInput(false)}
                >
                  <span>취소</span>
                </button>
                <button
                  type="submit"
                  className="flex h-9 w-28 items-center justify-center space-x-4 rounded-md bg-l-mainColor text-sm text-text-white dark:bg-d-mainColor"
                >
                  <span>모음집 추가</span>
                </button>
              </div>
            </div>
          </form>
        </OutsideClickHandler>
        <div className="h-48 w-full overflow-y-scroll bg-white">
          <ul>
            {seriesList &&
              seriesList?.map(({ id, name }) => (
                <li
                  className={cls(
                    'flex h-10 items-center border-b-[0.1rem] border-l-mainColor px-3 last:border-0',
                    selectedSeries === id ? 'bg-l-mainColor' : 'bg-transparent',
                  )}
                  key={id}
                >
                  <button
                    type="button"
                    className="flex w-full justify-start"
                    onClick={() => setSelectedSeries(id)}
                  >
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {name}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            className="flex h-9 w-12 items-center justify-center space-x-4 rounded-md bg-transparent text-sm text-l-mainColor "
            onClick={() => {
              setOpenSeriesMenu(false);
              setSelectedSeries(undefined);
            }}
          >
            <span>취소</span>
          </button>
          <button
            type="button"
            className="flex h-9 w-20 items-center justify-center space-x-4 rounded-md bg-l-mainColor text-sm text-text-white dark:bg-d-mainColor"
            onClick={() => setOpenSeriesMenu(false)}
          >
            <span>선택하기</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddSeriesContainer;
