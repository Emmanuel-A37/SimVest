'use client';
import { useEffect, useState } from "react";
import useAssetStore from "../hooks/useAssetStore";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formatDate = (isoDate) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(isoDate).toLocaleDateString('en-GB', options); // Formats as dd/mm/yyyy
};

const DashChart = () => {
    const { asset } = useAssetStore();
    const [user, setUser] = useState({});
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user', { method: 'GET' });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();

                // Format the dates and prepare the chart data
                const formattedData = data.portfolioValueHistory[asset]?.map((entry) => ({
                    date: formatDate(entry.date),
                    totalValue: entry.totalValue,
                })) || [];

                setUser(data);
                setChartData(formattedData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [asset]);

    if (!chartData.length) {
        return (
            <div className="text-center mt-5">
                <p>Loading investment data...</p>
            </div>
        );
    }

    return (
        <div className="mt-5 px-5">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Investment Progress</CardTitle>
                    <CardDescription>Your investment growth over time</CardDescription>
                </CardHeader>
                <CardContent>
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
                            <LineChart data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="totalValue" stroke="blue" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashChart;
