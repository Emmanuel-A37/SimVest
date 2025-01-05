'use client'
import { useEffect, useState } from "react";
import useAssetStore from "../hooks/useAssetStore"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DashChart = () => {
    const {asset} = useAssetStore();
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user', { method: 'GET' });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        console.log(user);

        fetchUserData();
    }, []);

    if (!user || !user.portfolioValueHistory || !user.portfolioValueHistory[asset]) {
        return (
            <div className="text-center mt-5">
                <p>Loading investment data...</p>
            </div>
        );
    }

    return(
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
                        <LineChart data={user.portfolioValueHistory[asset]}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="value" stroke="blue" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashChart