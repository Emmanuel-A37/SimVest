'use client'
import { useEffect, useState } from "react";
import useAssetStore from "../hooks/useAssetStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"




const Cards = () => {
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
                console.log('user data :', data);
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return(
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full px-5 my-9 lg:mt-[4.6rem]">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${user.financialMetrics && user.financialMetrics[asset] ? user.financialMetrics[asset].totalPortfolioValue.toFixed(2) : 'Loading...'}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium capitalize">{asset} Value</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${user.financialMetrics && user.financialMetrics[asset] ? user.financialMetrics[asset].investmentValue.toFixed(2) : 'Loading...'}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Cash Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${user.financialMetrics && user.financialMetrics[asset] ? user.financialMetrics[asset].remainingFunds.toFixed(2) : 'Loading...'}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">ROI</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {user.financialMetrics && user.financialMetrics[asset] ? user.financialMetrics[asset].roi.toFixed(2) : 'Loading...'}%
                    </div>
                </CardContent>
            </Card>
            
        </div>
    )
}

export default Cards