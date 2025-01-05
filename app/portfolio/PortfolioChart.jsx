'use client';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import useAssetStore from '../hooks/useAssetStore';
import { useState, useEffect } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4561', '#8A2BE2', '#D2691E', '#32CD32', '#FFD700', '#FF1493'];
 

const PortfolioChart = () => {
    const { asset } = useAssetStore();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                const portfolioData = data.portfolio[asset]?.map((asset) => ({
                    name: asset.assetName,
                    value: asset.currentValue || 0 
                })) || [];

                console.log('user data:', portfolioData);
                setUser(portfolioData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [asset]);
    
    if (user === null) {

        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading your portfolio data...</p>
            </div>
        );
    }

    if (user.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Make Some Trades and Track your progress here</p>
            </div>
        );
    }

    return (
        <div className="px-5 my-5">
            <Card >
                <CardHeader>
                    <CardTitle className="text-2xl  ">{asset === 'stocks' ? 'Stocks' : 'Crypto'} Breakdown</CardTitle>
                    <CardDescription>Distribution of your {asset} investments</CardDescription>
                </CardHeader>
                <CardContent className="flext items-center justify-center" >
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
                            <PieChart>
                                <Pie
                                    data={user}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {user.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default PortfolioChart;
