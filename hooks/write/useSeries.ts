import useDarkMode from '@hooks/useDarkMode';
import useMutation from '@hooks/useMutation';
import { ResponseType } from '@libs/server/withHandler';
import { makeAlert } from '@libs/util';
import { CustomSeries, SeiresResponseType } from 'pages/api/series';
import { useCallback, useEffect, useState } from 'react';
import {
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import useSWR from 'swr';

export interface AddSeriesFormType {
  seriesName: string;
  seriesURL: string;
}

export interface UseSeriesReturnType {
  selectedSeries: number | undefined;
  seriesList: CustomSeries[] | undefined;
  actions: {
    addSeries: (data: any) => void;
    setSelectedSeries: React.Dispatch<React.SetStateAction<number | undefined>>;
  };
  formActions: {
    register: UseFormRegister<AddSeriesFormType>;
    setValue: UseFormSetValue<AddSeriesFormType>;
    handleSubmit: UseFormHandleSubmit<AddSeriesFormType>;
  };
}

function useSeries(thumbnailPath: string | undefined): UseSeriesReturnType {
  const [selectedSeries, setSelectedSeries] = useState<number>();
  const { register, setValue, handleSubmit, reset } =
    useForm<AddSeriesFormType>();
  const [darkMode] = useDarkMode();
  const { data: seriesData, mutate } =
    useSWR<SeiresResponseType>('/api/series');
  const [addSeriesAPI, { data, error }] = useMutation<ResponseType>(
    '/api/write/series',
    'POST',
  );

  const addSeries = (formData: any) => {
    const body = {
      ...formData,
      ...(thumbnailPath && { thumbnailPath }),
    };
    addSeriesAPI(body);
  };

  const onError = useCallback(async () => {
    await makeAlert(
      { content: '모음집 등록에 실패했습니다.' },
      'error',
      darkMode,
    );
  }, [darkMode]);

  useEffect(() => {
    if (data && data.ok) {
      mutate();
      reset();
    }
  }, [data, mutate, reset]);

  useEffect(() => {
    if (error) {
      onError();
    }
  }, [error, onError]);

  return {
    selectedSeries,
    seriesList: seriesData?.series,
    actions: {
      setSelectedSeries,
      addSeries,
    },
    formActions: {
      register,
      setValue,
      handleSubmit,
    },
  };
}

export default useSeries;
