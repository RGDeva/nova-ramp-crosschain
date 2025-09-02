import { useState, useCallback } from "react";
import { RefreshCw, ExternalLink, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { OrderTimelineCard } from "@/components/OrderTimelineCard";
import { useAuth } from "@/contexts/PrivyProvider";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Mock orders data - in real app would fetch from Supabase
  const mockOrders = [
    {
      id: "ord_1a2b3c4d",
      type: "Onramp",
      provider: "Venmo", 
      amount: "$100.00",
      currency: "USDC",
      status: "proving" as const,
      txSignal: "0x1234567890abcdef1234567890abcdef12345678",
      txFulfill: null,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "ord_2b3c4d5e",
      type: "Onramp",
      provider: "Cash App",
      amount: "$50.00",
      currency: "USDC",
      status: "fulfilled" as const,
      txSignal: "0x2345678901bcdef02345678901bcdef023456789",
      txFulfill: "0x3456789012cdef103456789012cdef1034567890",
      createdAt: "2024-01-14T15:45:00Z",
    },
    {
      id: "ord_3c4d5e6f",
      type: "Onramp", 
      provider: "Revolut",
      amount: "$75.00",
      currency: "USDC",
      status: "failed" as const,
      txSignal: null,
      txFulfill: null,
      createdAt: "2024-01-13T09:15:00Z",
    },
  ];

  const handleAuthenticate = useCallback((orderId: string) => {
    toast({
      title: "Opening PeerAuth",
      description: "Please complete authentication in the PeerAuth extension.",
    });
  }, [toast]);

  const handleGenerateProof = useCallback((orderId: string) => {
    toast({
      title: "Generating Proof",
      description: "Zero-knowledge proof generation started...",
    });
  }, [toast]);

  const handleFulfill = useCallback((orderId: string) => {
    toast({
      title: "Fulfilling Order", 
      description: "Calling fulfillIntent contract...",
    });
  }, [toast]);

  const handleRetry = useCallback((orderId: string) => {
    toast({
      title: "Retrying Order",
      description: "Restarting the order process...",
    });
  }, [toast]);

  const filteredOrders = (status?: string) => {
    if (!status || status === 'all') return mockOrders;
    return mockOrders.filter(order => {
      switch (status) {
        case 'pending':
          return ['created', 'paying', 'auth', 'proving'].includes(order.status);
        case 'completed':
          return order.status === 'fulfilled';
        case 'failed':
          return ['failed', 'expired'].includes(order.status);
        default:
          return true;
      }
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">
            Track your on-ramp and off-ramp transactions
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {filteredOrders('all').map((order) => (
                <OrderTimelineCard
                  key={order.id}
                  orderId={order.id}
                  provider={order.provider}
                  amount={order.amount}
                  currency={order.currency}
                  status={order.status}
                  txSignal={order.txSignal}
                  txFulfill={order.txFulfill}
                  createdAt={order.createdAt}
                  onAuthenticate={handleAuthenticate}
                  onGenerateProof={handleGenerateProof}
                  onFulfill={handleFulfill}
                  onRetry={handleRetry}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {filteredOrders('pending').map((order) => (
                <OrderTimelineCard
                  key={order.id}
                  orderId={order.id}
                  provider={order.provider}
                  amount={order.amount}
                  currency={order.currency}
                  status={order.status}
                  txSignal={order.txSignal}
                  txFulfill={order.txFulfill}
                  createdAt={order.createdAt}
                  onAuthenticate={handleAuthenticate}
                  onGenerateProof={handleGenerateProof}
                  onFulfill={handleFulfill}
                  onRetry={handleRetry}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {filteredOrders('completed').map((order) => (
                <OrderTimelineCard
                  key={order.id}
                  orderId={order.id}
                  provider={order.provider}
                  amount={order.amount}
                  currency={order.currency}
                  status={order.status}
                  txSignal={order.txSignal}
                  txFulfill={order.txFulfill}
                  createdAt={order.createdAt}
                  onAuthenticate={handleAuthenticate}
                  onGenerateProof={handleGenerateProof}
                  onFulfill={handleFulfill}
                  onRetry={handleRetry}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="failed" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {filteredOrders('failed').map((order) => (
                <OrderTimelineCard
                  key={order.id}
                  orderId={order.id}
                  provider={order.provider}
                  amount={order.amount}
                  currency={order.currency}
                  status={order.status}
                  txSignal={order.txSignal}
                  txFulfill={order.txFulfill}
                  createdAt={order.createdAt}
                  onAuthenticate={handleAuthenticate}
                  onGenerateProof={handleGenerateProof}
                  onFulfill={handleFulfill}
                  onRetry={handleRetry}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Orders;