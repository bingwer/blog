import useMutation from '@hooks/useMutation';
import { ResponseType } from '@libs/server/withHandler';
import { CustomSeries, SeiresReturnType } from 'pages/api/series';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

interface UseSeriesReturnType {
  selectedSeries: number | undefined;
  setSelectedSeries: React.Dispatch<React.SetStateAction<number | undefined>>;
  seriesList: CustomSeries[] | undefined;
  addSeries: (data: any) => void;
}

function useSeries(): UseSeriesReturnType {
  const [selectedSeries, setSelectedSeries] = useState<number>();
  const { data: seriesData, mutate } = useSWR<SeiresReturnType>('/api/series');
  const [addSeriesAPI, { data }] =
    useMutation<ResponseType>('/api/write/series');

  const addSeries = (formData: any) => {
    addSeriesAPI(formData);
  };

  useEffect(() => {
    if (data && data.ok) mutate();
  }, [data, mutate]);

  return {
    selectedSeries,
    setSelectedSeries,
    seriesList: seriesData?.series,
    addSeries,
  };
}

export default useSeries;
