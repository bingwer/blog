import useDarkMode from '@hooks/useDarkMode';
import useMutation from '@hooks/useMutation';
import { ResponseType } from '@libs/server/withHandler';
import { makeAlert } from '@libs/util';
import { SeiresReturnType } from 'pages/api/series';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

export interface AddSeriesFormType {
  seriesName: string;
  seriesURL: string;
}

function useSeries() {
  const [selectedSeries, setSelectedSeries] = useState<number>();
  const { register, setValue, handleSubmit, reset } =
    useForm<AddSeriesFormType>();
  const [darkMode] = useDarkMode();
  const { data: seriesData, mutate } = useSWR<SeiresReturnType>('/api/series');
  const [addSeriesAPI, { data, error }] =
    useMutation<ResponseType>('/api/write/series');

  const addSeries = (formData: any) => {
    addSeriesAPI(formData);
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
