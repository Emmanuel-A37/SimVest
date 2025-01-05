'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAssetStore from '../hooks/useAssetStore';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PortfolioTable = () => {
    const { asset } = useAssetStore();
    const [user, setUser] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user', { method: 'GET' });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                const portfolioData = data.portfolio[asset] || [];
                console.log('user data:', portfolioData);
                setUser(portfolioData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load portfolio data.');
            }
        };

        fetchUserData();
    }, [asset]);

    if (user.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Make Some Trades and Track your progress here</p>
            </div>
        );
    }

    return (
        <div className="px-5 my-5">
            <Card>
                <CardHeader>
                    <CardTitle>{asset === 'stocks' ? 'Stocks' : 'Crypto'} Details</CardTitle>
                    <CardDescription>Detailed breakdown of your {asset} investments</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>{asset === 'stocks' ? 'Shares' : 'Amount'}</TableHead>
                                <TableHead>Current Cost</TableHead>
                                <TableHead>Average Value</TableHead>
                                <TableHead>Current Value</TableHead>
                                <TableHead>Change</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {user.map((item) => (
                                <TableRow key={item.assetId || item.assetName}>
                                    <TableCell>{item.assetName }</TableCell>
                                    <TableCell>{item.quantity} </TableCell>
                                    <TableCell>${(item.value).toFixed(2)}</TableCell>
                                    <TableCell>${(item.averageCost).toFixed(2)}</TableCell>
                                    <TableCell>${(item.currentValue).toFixed(2)}</TableCell>
                                    <TableCell
                                        className={item.change >= 0 ? 'text-green-600' : 'text-red-600'}
                                    >
                                        {item.change > 0 ? '+' : ''}
                                        {(item.change || 0).toFixed(2)}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default PortfolioTable;
