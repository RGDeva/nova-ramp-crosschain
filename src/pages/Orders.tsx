import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { OrderTimelineCard } from "@/components/OrderTimelineCard";
import { useAuth } from "@/contexts/PrivyProvider";
import { fetchUserOrders, updateOrder, Order } from "@/lib/inova-api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await fetchUserOrders();
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast({
        title: "Failed to load orders",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                  onAuthenticate={() => handleAuthenticate(order.id)}
                  onGenerateProof={() => handleGenerateProof(order.id)}
                  onFulfill={() => handleFulfill(order.id)}
                  onRetry={() => handleRetry(order.id)}
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
                  onAuthenticate={() => handleAuthenticate(order.id)}
                  onGenerateProof={() => handleGenerateProof(order.id)}
                  onFulfill={() => handleFulfill(order.id)}
                  onRetry={() => handleRetry(order.id)}
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
                  onAuthenticate={() => handleAuthenticate(order.id)}
                  onGenerateProof={() => handleGenerateProof(order.id)}
                  onFulfill={() => handleFulfill(order.id)}
                  onRetry={() => handleRetry(order.id)}
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
                  onAuthenticate={() => handleAuthenticate(order.id)}
                  onGenerateProof={() => handleGenerateProof(order.id)}
                  onFulfill={() => handleFulfill(order.id)}
                  onRetry={() => handleRetry(order.id)}
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