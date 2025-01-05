"use client"
import React, {useState, useEffect} from 'react'
import { sevenDays, sevenWeeks, sevenMonths } from './symbols'
import useAssetStore from "../hooks/useAssetStore"
import useTicker from '../hooks/useTickerStore'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const PerformanceBar = () => {
  const {asset} = useAssetStore();
  const {ticker} = useTicker();
  const [data, setData] = useState([]);
  const [range, setRange] = useState("day");

  useEffect(() => {
    const fetchData = async () => {
        let tempData;
        if(range == 'day'){
          tempData = await sevenDays(asset, ticker);
        }
        else if(range == 'week'){
          tempData = await sevenWeeks(asset, ticker);
        }
        else if (range == 'month'){
          tempData = await sevenMonths(asset, ticker);
        }
        setData(tempData);
    }
    fetchData();

  },[range, ticker] )
 
  if(!data || !ticker){
    return(
      <div></div>
    )
  }
  
  return (
        <div className="mt-5 px-5">
          <Card>
              <CardHeader >
                  <CardTitle className="text-xl">{ticker} Progress</CardTitle>
                  <CardDescription>7-{range} price history</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <ChartContainer
                      config={{
                          value: {
                              label: "Value",
                              color: "hsl(var(--chart-1))",
                          },
                      }}
                      className="h-[300px]"
                  >
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data}>
                              <CartesianGrid vertical={false} />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />                              
                              <Line type="monotone" dataKey="value" stroke="blue" strokeWidth={3} />
                          </LineChart>
                      </ResponsiveContainer>
                  </ChartContainer>

                </div>
                <div className="flex flex-row gap-5 ml-14">
                  <Button
                      variant="outline"
                      className={`px-4 py-2 w-[5rem] border border-transparent rounded-xl shadow-sm text-base font-medium  text-white hover:bg-blue-900 ${range == 'day' ? 'bg-blue-900' : 'bg-blue-600'}`}
                      onClick={() => setRange('day')} 
                    >
                      Days
                  </Button>
                  <Button
                      variant="outline"
                      className={`px-4 py-2 w-[5rem] border border-transparent rounded-xl shadow-sm text-base font-medium  text-white hover:bg-blue-900 ${range == 'week' ? 'bg-blue-900' : 'bg-blue-600'}`}
                      onClick={() => setRange('week')} 
                    >
                      Weeks
                  </Button>
                  <Button
                      variant="outline"
                      className={`px-4 py-2 border w-[5rem] border-transparent rounded-xl shadow-sm text-base font-medium  text-white hover:bg-blue-900 ${range == 'month' ? 'bg-blue-900' : 'bg-blue-600'}`}
                      onClick={() => setRange('month')} 
                    >
                      Months
                  </Button>
                </div>
              </CardContent>
          </Card>
        </div>
  )
}

export default PerformanceBar